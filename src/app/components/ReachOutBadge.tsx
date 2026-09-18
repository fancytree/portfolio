// "Reach out" 印章徽标：黑底橙色弧形文字缓慢旋转，中间一个信封，点击发邮件。
// 页脚和 Playground 卡片共用；尺寸由调用方通过 className 决定。

import { Mail } from 'lucide-react';

export default function ReachOutBadge({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <a
      href="mailto:mei.chai@mail.polimi.it"
      aria-label="Email Mei"
      style={style}
      className={`relative flex shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <img src="/img/footer/reach-out-badge.svg" alt="" className="mei-badge-spin absolute inset-0 size-full" />
      <Mail size={28} strokeWidth={1.5} className="relative text-[#ed5b2b] md:size-8" />
    </a>
  );
}
