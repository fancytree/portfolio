// Reads the stylesheets at build time, so the reference page can never drift from them.
import fs from 'node:fs';
import path from 'node:path';

const read = (file: string) =>
  fs.readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

export type Token = { name: string; value: string; resolved: string };

/** Every token in case.css, with its base value and what it resolves to on a desktop screen. */
export function readTokens(): Token[] {
  const base = read('src/lib/design-tokens/case.css').split('@media')[0];
  const values = new Map<string, string>();
  for (const [, name, value] of base.matchAll(/(--case-[\w-]+)\s*:\s*([^;]+);/g)) values.set(name, value.trim());
  const resolve = (value: string, depth = 0): string =>
    depth > 5 ? value : value.replace(/var\((--case-[\w-]+)\)/g, (all, name) => (values.has(name) ? resolve(values.get(name)!, depth + 1) : all));
  return [...values].map(([name, value]) => ({ name, value, resolved: resolve(value) }));
}

/** Stylesheets of the portfolio's own interface. Product demos and cover art are left out. */
export const shellFiles = [
  'src/app/globals.css',
  'src/app/river/river.module.css',
  'src/app/components/Preloader.module.css',
  'src/app/playground/playground.module.css',
  'src/app/playground/design-should-run/article.module.css',
  'src/app/components/case-kit/case-kit.module.css',
  'src/app/components/case-kit/case-content.css',
  'src/app/components/case-kit/case-button.module.css',
  'src/app/components/case-kit/case-workflow.module.css',
];

export type Kind = 'Type size' | 'Radius' | 'Colour' | 'Font';

export type HandWritten = {
  kind: Kind;
  value: string;
  uses: number;
  files: string[];
  /** The token that would replace it, if there is a sensible one. */
  token?: string;
  /** exact: no visual change. near: it would change by `delta`. none: needs a decision. */
  match: 'exact' | 'near' | 'none';
  delta?: string;
};

const hex = (value: string) => {
  const v = value.toLowerCase();
  return /^#[0-9a-f]{3}$/.test(v) ? `#${[...v.slice(1)].map((c) => c + c).join('')}` : v;
};
const px = (value: string) => (/^[\d.]+px$/.test(value) ? parseFloat(value) : null);

/** Literal values still written by hand in those stylesheets, each with its closest token. */
export function readHandWritten(tokens: Token[]): HandWritten[] {
  const found = new Map<string, { kind: Kind; value: string; uses: number; files: Set<string> }>();
  const add = (kind: Kind, value: string, file: string) => {
    const key = `${kind}|${value}`;
    const row = found.get(key) ?? { kind, value, uses: 0, files: new Set<string>() };
    row.uses += 1;
    row.files.add(path.basename(file));
    found.set(key, row);
  };
  for (const file of shellFiles) {
    for (const [, prop, raw] of read(file).matchAll(/(?<![\w-])([\w-]+)\s*:\s*([^;{}]+)[;}]/g)) {
      const value = raw.replace('!important', '').trim();
      if (prop === 'font-size' && /^[\d.]+(px|rem|em)$/.test(value)) add('Type size', value, file);
      if (prop === 'border-radius' && /^[\d.]+(px|rem)?$/.test(value) && value !== '0') add('Radius', value, file);
      if (prop === 'font-family' && !/^(var\(--(case|river)-[\w-]+\)|inherit)$/.test(value)) add('Font', value, file);
      for (const [colour] of value.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) add('Colour', hex(colour), file);
    }
  }

  // Only base tokens count as targets, not aliases or one-off component values.
  const scale = (prefix: string) =>
    tokens.filter((t) => t.name.startsWith(prefix) && px(t.value) !== null);
  const sizes = scale('--case-text-');
  const radii = scale('--case-radius-');
  const colours = tokens.filter((t) => /^#[0-9a-fA-F]{3,6}$/.test(t.value));

  return [...found.values()]
    .map(({ files, ...row }): HandWritten => {
      const base = { ...row, files: [...files].sort() };
      if (row.kind === 'Colour') {
        const token = colours.find((t) => hex(t.value) === row.value);
        return token ? { ...base, token: token.name, match: 'exact' } : { ...base, match: 'none' };
      }
      if (row.kind === 'Font') return { ...base, match: 'none' };
      const n = px(row.value);
      const list = row.kind === 'Type size' ? sizes : radii;
      if (n === null) return { ...base, match: 'none' };
      const best = [...list].sort((a, b) => Math.abs(px(a.resolved)! - n) - Math.abs(px(b.resolved)! - n))[0];
      const diff = px(best.resolved)! - n;
      if (diff === 0) return { ...base, token: best.name, match: 'exact' };
      if (Math.abs(diff) > 2) return { ...base, match: 'none' };
      return { ...base, token: best.name, match: 'near', delta: `${diff > 0 ? '+' : ''}${+diff.toFixed(1)}px` };
    })
    .sort((a, b) => b.uses - a.uses);
}
