// "Not daily fun" — 占位页面，之后填充内容（off-hours / 个人作品等）。
// 复用全局 .mei-works-page / .mei-works-header 样式，保持与重设计一致的视觉。

export const metadata = {
  title: 'Not daily fun — Mei Chai',
};

export default function NotDailyFunPage() {
  return (
    <section
      className="mei-works-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <header className="mei-works-header">
        <h1>Not daily fun</h1>
        <p>The off-hours stuff — experiments, side quests, and things I make when no one&apos;s briefing me. Coming soon.</p>
      </header>
    </section>
  );
}
