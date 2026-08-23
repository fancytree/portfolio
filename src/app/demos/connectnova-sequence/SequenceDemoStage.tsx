'use client';

import dynamic from 'next/dynamic';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';

const SequenceDemoWorkspace = dynamic(
  () => import('@/components/demo/SequenceDemoWorkspace').then((m) => m.SequenceDemoWorkspace),
  { ssr: false },
);

export default function SequenceDemoStage() {
  return (
    <div className="flex h-[100svh] w-screen flex-col overflow-hidden bg-[#eef0f4]">
      {/* Window chrome, deliberately matching the Procurement Agent demo so the
          two cards on the homepage read as a pair. These greys are OS chrome,
          not ConnectNova brand colour, so they stay outside the token scope. */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[#e8eaef] bg-[#f6f7f9] px-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => window.parent?.postMessage({ type: DEMO_CLOSE_MESSAGE }, window.location.origin)}
            aria-label="Close the demo"
            title="Close"
            className="group grid size-[11px] cursor-pointer place-items-center rounded-full bg-[#ff5f57] transition-colors hover:bg-[#e0443e] focus-visible:bg-[#e0443e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b93a7]"
          >
            <svg
              viewBox="0 0 8 8"
              aria-hidden="true"
              className="size-[7px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <path
                d="M1.6 1.6 6.4 6.4 M6.4 1.6 1.6 6.4"
                stroke="#5c0a06"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="size-[11px] rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="size-[11px] rounded-full bg-[#28c840]" aria-hidden="true" />
        </div>
        <p className="min-w-0 truncate font-mono text-[12px] text-[#8b93a7]">
          ConnectNova - Sequence Builder
        </p>
      </div>

      <div className="cn-demo-scope min-h-0 flex-1 bg-[var(--cn-surface-subtle)]">
        <SequenceDemoWorkspace />
      </div>
    </div>
  );
}
