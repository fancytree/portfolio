'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type ChatRole = 'user' | 'assistant';
type ChatSource = { project?: string | null; type?: string | null; title?: string | null };
type ChatMessage = { id: string; role: ChatRole; content: string; sources?: ChatSource[]; followUps?: string[] };
type ChatApiMessage = { role: ChatRole; content: string };

function createWelcomeMessage(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      "Hi! I'm here to help you learn more about Mei's work. Feel free to ask me anything about the projects, skills, or experience!",
  };
}

function getDefaultSuggestions(seedText: string) {
  const isChinese = /[\u4e00-\u9fff]/.test(seedText);
  if (isChinese) {
    return [
      '介绍一下你自己和你的背景。',
      '你最擅长的技能是什么？',
      '你通常怎么开展一个项目？',
    ];
  }
  return [
    'Tell me about yourself and your background.',
    'What skills do you specialize in?',
    'How do you usually run a project end to end?',
  ];
}

export default function AIChatWidget() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDialogReady, setIsDialogReady] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const headerTitle = useMemo(() => "Ask About Mei's Work", []);
  const poweredByText = useMemo(() => 'Powered by AI', []);

  // 使用平台“黑色”作为主视觉，避免组件内部硬编码蓝色造成风格不一致
  const platformBlack = '#111827';
  const platformBlackHover = '#0F172A';
  const platformBlackPressed = '#0B1220';
  const chatEndpoint = process.env.NEXT_PUBLIC_CHAT_API_URL ?? '/api/chat';
  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((m) => m.role === 'assistant'),
    [messages]
  );
  const hasUserAsked = useMemo(() => messages.some((m) => m.role === 'user'), [messages]);
  const defaultSuggestions = useMemo(
    () => getDefaultSuggestions(latestAssistantMessage?.content ?? ''),
    [latestAssistantMessage]
  );
  const activeSuggestions = hasUserAsked
    ? latestAssistantMessage?.followUps?.filter((item) => item.trim().length > 0).slice(0, 3) ?? []
    : defaultSuggestions;

  useEffect(() => {
    if (!isDialogVisible) return;
    // 等待对话框进入后再滚动，避免动画阶段滚动抖动
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, [isDialogVisible, messages.length]);

  const openDialog = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsDialogVisible(true);
    setIsDialogReady(false);
    requestAnimationFrame(() => {
      setIsDialogReady(true);
    });
  };

  const closeDialog = () => {
    if (!isDialogVisible) return;
    setIsDialogReady(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsDialogVisible(false);
      closeTimerRef.current = null;
    }, 180);
  };

  const clearConversation = () => {
    // 清空历史并保留欢迎语，避免弹窗出现空白状态
    setMessages([createWelcomeMessage()]);
    setInput('');
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    setIsSending(true);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content };
    const newMessages: ChatMessage[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      const conversationHistory: ChatApiMessage[] = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        }),
      });

      if (!res.ok) {
        let detail = 'Request failed';
        try {
          const errData = (await res.json()) as { error?: string; response?: string };
          detail = errData.error || errData.response || detail;
        } catch {
          // ignore json parse failure
        }
        throw new Error(`${detail} (HTTP ${res.status})`);
      }

      const data = (await res.json()) as { response?: string; sources?: ChatSource[]; followUps?: string[] };
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response ?? 'I could not generate a response this time.',
        sources: Array.isArray(data.sources) ? data.sources : [],
        followUps: Array.isArray(data.followUps) ? data.followUps : [],
      };
      setMessages([...newMessages, assistantMsg]);
    } catch (error) {
      console.error('Chat request failed:', error);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I could not reach the chat service right now. Please try again in a moment.',
      };
      setMessages([...newMessages, assistantMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* 右下角悬浮入口 */}
      {!isDialogVisible && (
        <button
          type="button"
          aria-label="Open AI chat"
          onClick={openDialog}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => {
            setIsButtonHovered(false);
            setIsButtonPressed(false);
          }}
          onMouseDown={() => setIsButtonPressed(true)}
          onMouseUp={() => setIsButtonPressed(false)}
          onBlur={() => {
            setIsButtonHovered(false);
            setIsButtonPressed(false);
          }}
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 56,
            height: 56,
            borderRadius: '9999px',
            boxShadow: isButtonHovered
              ? '0 22px 55px rgba(0,0,0,0.35)'
              : '0 12px 30px rgba(0,0,0,0.18)',
            border: isButtonHovered ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.25)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease, border-color 140ms ease',
            transform: isButtonPressed ? 'scale(0.95)' : isButtonHovered ? 'scale(1.12)' : 'scale(1)',
            backgroundColor: isButtonPressed ? platformBlackPressed : isButtonHovered ? platformBlackHover : platformBlack,
          }}
        >
          <Image src="/ChatBubble.svg" alt="Chat" width={24} height={24} />
        </button>
      )}

      {/* 聊天弹窗 */}
      {isDialogVisible && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 360,
            maxWidth: 'calc(100vw - 40px)',
            height: 600,
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
            border: '1px solid rgba(0,0,0,0.08)',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transformOrigin: 'bottom right',
            opacity: isDialogReady ? 1 : 0,
            transform: isDialogReady ? 'translate(0px, 0px) scale(1)' : 'translate(18px, 18px) scale(0.96)',
            transition: 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 160ms ease',
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              padding: '16px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: platformBlack,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image src="/ChatBubble.svg" alt="Chat" width={16} height={16} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{headerTitle}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {poweredByText}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                aria-label="Clear conversation"
                onClick={clearConversation}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.92)',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  transition: 'transform 140ms ease, background-color 140ms ease',
                }}
              >
                {/* 清空对话图标（垃圾桶，留足边距避免裁切） */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6h18"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6V4h8v2M8 6v13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6M10 10v6M14 10v6"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Close AI chat"
                onClick={closeDialog}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.92)',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  transition: 'transform 140ms ease, background-color 140ms ease',
                }}
              >
                {/* 细线关闭图标，比文字 × 更轻、不显得粗重 */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth={1.35}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            style={{
              padding: '14px 16px',
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.55)', fontSize: 12, marginTop: 8 }}>
                  Try asking about case studies, research methods, or tools.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '20px',
                      fontSize: 14,
                      padding: '10px 12px',
                      borderRadius: 14,
                      backgroundColor: m.role === 'user' ? platformBlack : 'rgba(0, 0, 0, 0.05)',
                      color: m.role === 'user' ? '#ffffff' : '#111827',
                      border: m.role === 'user' ? '1px solid rgba(17,24,39,0.35)' : '1px solid rgba(0,0,0,0.10)',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9999,
                      border: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 50 50" aria-hidden="true">
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="rgba(17,24,39,0.25)"
                        strokeWidth="5"
                      />
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="rgba(17,24,39,0.9)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="31.4 125.6"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="0.9s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                </div>
              )}
              {!isSending && latestAssistantMessage && activeSuggestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
                  {activeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      style={{
                        border: '1px solid rgba(0,0,0,0.12)',
                        backgroundColor: '#ffffff',
                        color: '#111827',
                        borderRadius: 9999,
                        padding: '6px 10px',
                        fontSize: 12,
                        lineHeight: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              backgroundColor: '#ffffff',
            }}
          >
            {/* 整条输入框外观：发送按钮嵌在输入区域右侧内部 */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.12)',
                backgroundColor: '#ffffff',
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my work..."
                disabled={isSending}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 12,
                  border: 'none',
                  padding: '12px 52px 12px 14px',
                  fontSize: 14,
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: '#111827',
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                aria-label="Send message"
                onClick={sendMessage}
                disabled={!input.trim() || isSending}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  backgroundColor: platformBlack,
                  color: '#ffffff',
                  border: 'none',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                  opacity: !input.trim() || isSending ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

