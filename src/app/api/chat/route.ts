import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import type { Row } from '@libsql/client';

type ChatTurn = {
  role: 'user' | 'assistant';
  content: string;
};

type KnowledgeRow = {
  id?: number;
  project?: string | null;
  type?: string | null;
  title?: string | null;
  content?: string | null;
  participant?: string | null;
  tags?: string | null;
};
type ChatApiSource = { project?: string | null; type?: string | null; title?: string | null };

// Turso：TURSO_DATABASE_URL（libsql:// 或 file: 本地）；远程 libsql:// 必须配置 TURSO_AUTH_TOKEN
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

/** 去掉换行、首尾空格、包裹引号，避免 Vercel / 复制粘贴导致 Turso 返回 HTTP 400 */
function normalizeTursoUrl(url: string): string {
  return url.trim().replace(/\r/g, '').replace(/\n/g, '').trim();
}

function normalizeTursoAuthToken(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let t = raw.trim().replace(/\r/g, '').replace(/\n/g, '');
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  return t.length > 0 ? t : undefined;
}

/** 将 libSQL 底层错误转成访客可读说明（不暴露密钥） */
function mapTursoErrorToUserMessage(msg: string): string {
  if (/SERVER_ERROR|HTTP status 400|status 400|HttpServerError/i.test(msg)) {
    return [
      'Knowledge database connection failed (HTTP 400 — usually an invalid, expired, or malformed Turso token).',
      'In Vercel → Settings → Environment Variables, set TURSO_AUTH_TOKEN to the database token from the Turso dashboard (Database → Show token), with no quotes or line breaks.',
      'Confirm TURSO_DATABASE_URL matches Connect exactly. Regenerate the token on Turso if it was rotated.',
    ].join(' ');
  }
  if (/401|Unauthorized|FORBIDDEN|403/i.test(msg)) {
    return 'Knowledge database rejected the credentials. Check TURSO_AUTH_TOKEN on Vercel matches the current Turso database token.';
  }
  return msg;
}
const geminiApiKey = process.env.GEMINI_API_KEY;
const knowledgeTable =
  process.env.CHAT_KNOWLEDGE_TABLE ?? process.env.SUPABASE_KNOWLEDGE_TABLE ?? 'portfolio_knowledge';
const aboutTable = process.env.CHAT_ABOUT_TABLE ?? process.env.SUPABASE_ABOUT_TABLE;
const aboutContentColumn = process.env.SUPABASE_ABOUT_CONTENT_COLUMN ?? 'content';
const aboutTitleColumn = process.env.SUPABASE_ABOUT_TITLE_COLUMN ?? 'title';
const aboutTypeColumn = process.env.SUPABASE_ABOUT_TYPE_COLUMN ?? 'type';
const aboutProjectLabel = process.env.SUPABASE_ABOUT_PROJECT_LABEL ?? 'about_me';
const aboutBodyColumns = (process.env.SUPABASE_ABOUT_BODY_COLUMNS ??
  [
    'Core Projects & Responsibilities',
    'Quantifiable Metrics & Outcomes',
    'Org / Location/Duration',
    'Title / Role',
    'Category',
    'content',
  ].join(','))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const geminiModel = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';
const geminiApiVersions = ['v1beta', 'v1'] as const;

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function toContext(rows: KnowledgeRow[]) {
  return rows
    .map((row, idx) => {
      const parts = [
        `Source ${idx + 1}`,
        row.project ? `project=${row.project}` : null,
        row.type ? `type=${row.type}` : null,
        row.title ? `title=${row.title}` : null,
        row.participant ? `participant=${row.participant}` : null,
        row.tags ? `tags=${row.tags}` : null,
        row.content ? `content=${normalize(row.content)}` : null,
      ].filter(Boolean);
      return parts.join(' | ');
    })
    .join('\n');
}

function extractKeywords(question: string) {
  const cleaned = question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(' ').filter((token) => token.length >= 2);
  const deduped = Array.from(new Set(tokens));
  return deduped.slice(0, 8);
}

function isAboutIntent(question: string) {
  const q = question.toLowerCase();
  return (
    /about[\s_-]?me|who are you|your background|your experience|introduce yourself|bio/.test(q) ||
    /你是谁|自我介绍|你的背景|你的经历|关于你自己|介绍一下你/.test(question)
  );
}

/** 仅允许字母数字下划线，防止 SQL 注入 */
function assertSafeTableName(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error('Invalid table name');
  }
  return name;
}

function quoteIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function rowToRecord(columns: string[], row: Row): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (let i = 0; i < columns.length; i++) {
    o[columns[i]!] = row[i];
  }
  return o;
}

function toKnowledgeRow(raw: Record<string, unknown>): KnowledgeRow | null {
  const content = raw.content;
  if (typeof content !== 'string' || content.trim().length === 0) return null;
  const idVal = raw.id;
  const id =
    typeof idVal === 'number'
      ? idVal
      : typeof idVal === 'bigint'
        ? Number(idVal)
        : typeof idVal === 'string' && /^\d+$/.test(idVal)
          ? Number(idVal)
          : undefined;
  return {
    id,
    project: raw.project != null ? String(raw.project) : null,
    type: raw.type != null ? String(raw.type) : null,
    title: raw.title != null ? String(raw.title) : null,
    content,
    participant: raw.participant != null ? String(raw.participant) : null,
    tags: raw.tags != null ? String(raw.tags) : null,
  };
}

/** 去掉 LIKE 通配符，避免注入与误匹配 */
function keywordForLike(token: string): string {
  return token.toLowerCase().replace(/%/g, '').replace(/_/g, '').replace(/\\/g, '').trim();
}

/** 多关键词 OR：每列 lower(...) LIKE '%' || ? || '%' */
function buildKeywordWhereClause(keywords: string[]): { clause: string; args: string[] } {
  const cols = ['content', 'title', 'project', 'tags', 'type'] as const;
  const parts: string[] = [];
  const args: string[] = [];
  for (const kw of keywords) {
    const lit = keywordForLike(kw);
    if (!lit) continue;
    for (const col of cols) {
      parts.push(`lower(coalesce(${quoteIdent(col)},'')) like '%' || ? || '%'`);
      args.push(lit);
    }
  }
  return { clause: parts.join(' OR '), args };
}

function readStringField(row: Record<string, unknown>, candidates: string[]) {
  for (const key of candidates) {
    const value = row[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return '';
}

function mapAboutRows(rawRows: Array<Record<string, unknown>>): KnowledgeRow[] {
  const mapped: KnowledgeRow[] = [];
  rawRows.forEach((row, index) => {
    const directContent = String(row[aboutContentColumn] ?? '').trim();
    const assembledBody = aboutBodyColumns
      .map((columnName) => {
        const value = String(row[columnName] ?? '').trim();
        if (!value) return '';
        return `${columnName}: ${value}`;
      })
      .filter(Boolean)
      .join('\n');
    const content = directContent || assembledBody;
    if (!content) return;
    const title =
      readStringField(row, [aboutTitleColumn, 'Title / Role', 'Title', 'Role']) || 'About Mei';
    const type =
      readStringField(row, [aboutTypeColumn, 'Category', 'Type']) || 'about';
    const idValue = row.id;
    const id = typeof idValue === 'number' ? idValue : index + 1;
    mapped.push({
      id,
      project: aboutProjectLabel,
      type: type || 'about',
      title: title || 'About Mei',
      content,
      tags: 'about',
    });
  });
  return mapped;
}

async function fetchKnowledge(question: string) {
  const url = normalizeTursoUrl(tursoUrl ?? '');
  const token = normalizeTursoAuthToken(tursoAuthToken);

  if (!url) {
    return {
      rows: [] as KnowledgeRow[],
      error: 'TURSO_DATABASE_URL is missing. Configure Turso (libSQL) for the chat knowledge base.',
      emptyReason: null as string | null,
    };
  }

  if (url.startsWith('libsql://') && !token) {
    return {
      rows: [] as KnowledgeRow[],
      error:
        'TURSO_AUTH_TOKEN is missing or empty. Remote Turso requires the database token from the Turso dashboard (no quotes or line breaks).',
      emptyReason: null as string | null,
    };
  }

  let knowledgeTblQuoted: string;
  let aboutTblQuoted: string | undefined;
  try {
    knowledgeTblQuoted = quoteIdent(assertSafeTableName(knowledgeTable));
    aboutTblQuoted = aboutTable ? quoteIdent(assertSafeTableName(aboutTable)) : undefined;
  } catch {
    return {
      rows: [] as KnowledgeRow[],
      error: 'Invalid CHAT_* / SUPABASE_* table name in environment (use letters, numbers, underscore only).',
      emptyReason: null as string | null,
    };
  }

  const client = createClient({
    url,
    authToken: token,
  });

  const aboutIntent = isAboutIntent(question);
  const keywords = extractKeywords(question);
  const fallbackToken = question.trim().slice(0, 64);
  const searchKeywords = keywords.length > 0 ? keywords : fallbackToken ? [fallbackToken] : [];
  const mergedRows: KnowledgeRow[] = [];

  try {
    if (aboutIntent && aboutTblQuoted) {
      const r = await client.execute({
        sql: `SELECT * FROM ${aboutTblQuoted} LIMIT 8`,
        args: [],
      });
      const records = r.rows.map((row) => rowToRecord(r.columns, row));
      mergedRows.push(...mapAboutRows(records));
    }

    if (aboutIntent) {
      const r = await client.execute({
        sql:
          `SELECT * FROM ${knowledgeTblQuoted} ` +
          `WHERE lower(coalesce(project,'')) LIKE '%about%' OR lower(coalesce(type,'')) LIKE '%about%' ` +
          `OR lower(coalesce(tags,'')) LIKE '%about%' OR lower(coalesce(title,'')) LIKE '%about%' ` +
          `LIMIT 8`,
        args: [],
      });
      for (const row of r.rows) {
        const kr = toKnowledgeRow(rowToRecord(r.columns, row));
        if (kr) mergedRows.push(kr);
      }
    }

    if (searchKeywords.length > 0) {
      const { clause, args } = buildKeywordWhereClause(searchKeywords);
      if (clause.length > 0) {
        const r = await client.execute({
          sql: `SELECT * FROM ${knowledgeTblQuoted} WHERE (${clause}) LIMIT 10`,
          args,
        });
        for (const row of r.rows) {
          const kr = toKnowledgeRow(rowToRecord(r.columns, row));
          if (kr) mergedRows.push(kr);
        }
      }
    }

    if (mergedRows.length > 0) {
      const unique = Array.from(
        new Map(
          mergedRows.map((row, index) => [`${row.id ?? `row-${index}`}-${row.title ?? ''}-${row.project ?? ''}`, row])
        ).values()
      ).slice(0, 12);
      return { rows: unique, error: null as string | null, emptyReason: null as string | null };
    }

    const fb = await client.execute({
      sql: `SELECT * FROM ${knowledgeTblQuoted} LIMIT 12`,
      args: [],
    });
    const fallbackRows: KnowledgeRow[] = [];
    for (const row of fb.rows) {
      const kr = toKnowledgeRow(rowToRecord(fb.columns, row));
      if (kr) fallbackRows.push(kr);
    }
    if (fallbackRows.length > 0) {
      return { rows: fallbackRows, error: null as string | null, emptyReason: null as string | null };
    }

    const cnt = await client.execute({
      sql: `SELECT COUNT(*) AS n FROM ${knowledgeTblQuoted}`,
      args: [],
    });
    const row0 = cnt.rows[0];
    const nVal = row0 ? (row0 as Row).n ?? row0[0] : undefined;
    if (nVal === undefined || nVal === null) {
      return { rows: [] as KnowledgeRow[], error: null as string | null, emptyReason: 'unreadable:count' };
    }
    const n = typeof nVal === 'bigint' ? Number(nVal) : Number(nVal);
    if (n === 0) {
      return { rows: [] as KnowledgeRow[], error: null as string | null, emptyReason: 'table_empty' };
    }
    return { rows: [] as KnowledgeRow[], error: null as string | null, emptyReason: 'no_usable_content' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { rows: [] as KnowledgeRow[], error: mapTursoErrorToUserMessage(msg), emptyReason: null as string | null };
  }
}

async function askGemini(question: string, history: ChatTurn[], contextText: string) {
  if (!geminiApiKey) {
    return {
      answer:
        'I found relevant portfolio context, but GEMINI_API_KEY is not configured yet. Please set it in environment variables.',
    };
  }
  const apiKey = geminiApiKey;

  const historyText = history
    .slice(-6)
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
    .join('\n');

  const prompt = [
    'You are Mei portfolio assistant.',
    'Answer ONLY using the provided portfolio context.',
    'Keep answers concise, practical, and specific.',
    'Respond in exactly the same language as the user question, whatever language it is.',
    'If context is insufficient, clearly say you do not know and ask a clarifying question.',
    'Do not invent facts.',
    '',
    'Conversation history:',
    historyText || '(none)',
    '',
    `User question: ${question}`,
    '',
    'Portfolio context:',
    contextText,
  ].join('\n');

  const candidateModels = Array.from(
    new Set([
      geminiModel,
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
    ])
  );

  async function listModels() {
    for (const version of geminiApiVersions) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/${version}/models?key=${encodeURIComponent(apiKey)}`
      );
      if (!res.ok) continue;
      const data = (await res.json()) as {
        models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
      };
      const found =
        data.models
          ?.filter((model) => {
            const supportsGenerate = model.supportedGenerationMethods?.includes('generateContent');
            return supportsGenerate && typeof model.name === 'string' && model.name.startsWith('models/gemini');
          })
          .map((model) => model.name?.replace(/^models\//, '') ?? '')
          .filter(Boolean) ?? [];
      if (found.length > 0) {
        return found;
      }
    }
    return [] as string[];
  }

  let lastError = '';
  const discoveredModels = await listModels();
  const allCandidates = Array.from(new Set([...candidateModels, ...discoveredModels]));

  async function callGeminiWithPrompt(prompt: string, temperature = 0.2) {
    for (const model of allCandidates) {
      for (const version of geminiApiVersions) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature,
              },
            }),
          }
        );

        if (!res.ok) {
          const body = await res.text();
          lastError = `Gemini error (${model}, ${version}): ${res.status} ${body}`;
          continue;
        }

        const data = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const output = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
        if (output) return output;
      }
    }
    return '';
  }

  const answer = await callGeminiWithPrompt(prompt, 0.2);
  if (!answer) {
    throw new Error(lastError || 'Gemini returned no usable response.');
  }

  const followUpPrompt = [
    'Based on the user question and assistant answer, suggest exactly 6 follow-up question candidates.',
    'Must be in the SAME language as the user question.',
    'Each follow-up must be answerable using the current portfolio context and assistant answer.',
    'Do NOT ask generic questions requiring unknown external info.',
    'Keep each follow-up concise and specific.',
    'Length limit: <= 32 characters for CJK languages, <= 16 words for non-CJK languages.',
    'Output plain text only: one question per line, no numbering, no bullets.',
    '',
    `User question: ${question}`,
    `Assistant answer: ${answer}`,
    'Portfolio context snapshot:',
    contextText,
  ].join('\n');

  const followUpRaw = await callGeminiWithPrompt(followUpPrompt, 0.3);
  const followUps = followUpRaw
    .split('\n')
    .map((line) => line.replace(/^[\-\d\.\)\s]+/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 6);

  return { answer, followUps: dedupeFollowUps(followUps, question, answer, contextText) };
}

function buildNoMatchFollowUps(question: string) {
  const isChinese = /[\u4e00-\u9fff]/.test(question);
  if (isChinese) {
    return ['你可以先问某个项目名，比如 Jobnova。', '你想了解研究方法还是最终成果？', '你希望我从角色、流程还是结果来讲？'];
  }
  return [
    'You can start with a specific project, like Jobnova.',
    'Would you like to focus on research methods or outcomes?',
    'Do you want a role-focused or process-focused breakdown?',
  ];
}

function normalizeForCompare(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNearDuplicate(a: string, b: string) {
  const na = normalizeForCompare(a);
  const nb = normalizeForCompare(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  const aTokens = new Set(na.split(' '));
  const bTokens = new Set(nb.split(' '));
  let overlap = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap++;
  }
  const ratio = overlap / Math.max(aTokens.size, bTokens.size, 1);
  return ratio >= 0.75;
}

function exceedsFollowUpLength(text: string) {
  const hasCJK = /[\u4e00-\u9fff]/.test(text);
  if (hasCJK) return text.length > 32;
  return text.length > 110 || text.split(/\s+/).length > 16;
}

function isLikelyAnswerableByContext(followUp: string, answer: string, contextText: string) {
  const q = normalizeForCompare(followUp);
  const combined = `${normalizeForCompare(answer)} ${normalizeForCompare(contextText)}`;
  if (!q || !combined) return false;
  const tokens = q.split(' ').filter((t) => t.length >= 2);
  if (tokens.length === 0) return false;
  let matched = 0;
  for (const token of tokens) {
    if (combined.includes(token)) matched++;
  }
  const ratio = matched / tokens.length;
  return ratio >= 0.34;
}

function dedupeFollowUps(followUps: string[], userQuestion: string, answer: string, contextText: string) {
  const unique: string[] = [];
  for (const item of followUps) {
    const text = item.trim();
    if (!text) continue;
    if (exceedsFollowUpLength(text)) continue;
    if (isNearDuplicate(text, userQuestion)) continue;
    if (!isLikelyAnswerableByContext(text, answer, contextText)) continue;
    if (unique.some((existing) => isNearDuplicate(existing, text))) continue;
    unique.push(text);
    if (unique.length >= 3) break;
  }
  return unique;
}

function buildSources(rows: KnowledgeRow[]): ChatApiSource[] {
  return rows.map((row) => ({
    project: row.project ?? null,
    type: row.type ?? null,
    title: row.title ?? null,
  }));
}

// 使用 Node 运行时，确保 @libsql/client 走稳定 HTTP 路径（避免 Edge 下异常）
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message?: string;
      conversationHistory?: ChatTurn[];
    };

    const question = (body.message ?? '').trim();
    const history = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];

    if (!question) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const { rows, error, emptyReason } = await fetchKnowledge(question);
    if (error) {
      const response =
        error.startsWith('Knowledge database') ||
        error.includes('TURSO_DATABASE_URL') ||
        error.includes('TURSO_AUTH_TOKEN') ||
        error.includes('Invalid CHAT_')
          ? error
          : `Knowledge search failed: ${error}`;
      return NextResponse.json(
        {
          response,
          sources: [],
          followUps: buildNoMatchFollowUps(question),
        },
        { status: 200 }
      );
    }

    if (rows.length === 0) {
      const response =
        emptyReason === 'table_empty' || emptyReason?.startsWith('unreadable') || emptyReason === 'no_usable_content'
          ? `I cannot read usable knowledge data from Turso right now. Please verify table names in environment variables and that the knowledge table contains rows with non-empty content.${emptyReason ? ` (${emptyReason})` : ''}`
          : "I couldn't find a strong match for your question in the knowledge base yet. Please rephrase or mention a project name directly (Jobnova, MemQ, Mono, Clarity, etc.).";
      return NextResponse.json({
        response,
        sources: [],
        followUps: buildNoMatchFollowUps(question),
      });
    }

    const contextText = toContext(rows);
    const { answer, followUps } = await askGemini(question, history, contextText);

    return NextResponse.json({
      response: answer,
      sources: buildSources(rows),
      followUps,
    });
  } catch (error) {
    console.error('Chat API failed:', error);
    const detail = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      {
        error: detail,
        response: `The chat service failed unexpectedly. Please try again. (${detail})`,
        sources: [],
        followUps: [],
      },
      { status: 200 }
    );
  }
}
