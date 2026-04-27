// Showcase 卡片组件
// 使用方法：<ShowcaseCard title="标题" description="描述" tags={['标签1', '标签2']} href="/projects/xxx" />

import Image from 'next/image';
import Link from 'next/link';

interface ShowcaseCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  imageScale?: number;
  imageFit?: 'cover' | 'contain';
  imageBg?: string;       // CSS background 值（纯渐变/颜色），不传时默认 bg-gray-300
  bgImageUrl?: string;    // 模糊底层图片 URL，与 imageBg 叠加使用
  bgBlur?: number;        // 模糊半径 px，默认 24
  bgOverlay?: string;     // 底层图片上的渐变叠加，默认半透明深色
  fullWidth?: boolean;
  href?: string;
}

export default function ShowcaseCard({
  title,
  description,
  tags,
  imageUrl,
  imageScale = 1,
  imageFit = 'cover',
  imageBg,
  bgImageUrl,
  bgBlur = 24,
  bgOverlay = 'rgba(10, 20, 60, 0.45)',
  fullWidth = false,
  href,
}: ShowcaseCardProps) {
  const fontStyle = { fontFamily: 'system-ui, -apple-system, sans-serif' };

  const CardContent = (
    <div
      className="flex flex-col cursor-pointer group"
      style={fullWidth ? { gridColumn: 'span 2' } : {}}
    >
      {/* 封面区 */}
      <div
        className={`w-full aspect-video rounded-t-2xl overflow-hidden mb-4 relative${!imageBg && !bgImageUrl ? ' bg-gray-300' : ''}`}
        style={{ minHeight: '200px', ...(imageBg ? { background: imageBg } : {}) }}
      >
        {/* 模糊底层图 */}
        {bgImageUrl && (
          <>
            <Image
              src={bgImageUrl}
              alt=""
              fill
              className="object-cover"
              style={{
                filter: `blur(${bgBlur}px)`,
                transform: 'scale(1.12)',
                opacity: 0.9,
              }}
              aria-hidden
            />
            {/* 颜色/渐变叠加 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: bgOverlay,
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* 主图 */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={1280}
            height={720}
            className={`w-full h-full ${imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            style={{
              transform: `scale(${imageScale})`,
              transformOrigin: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          />
        )}

        {/* 右下角箭头 */}
        <div
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md"
          style={{ zIndex: 3 }}
        >
          <Image src="/arrow.svg" alt="Arrow" width={20} height={20} className="object-contain" />
        </div>
      </div>

      {/* 文字区 */}
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded"
              style={{ ...fontStyle, fontSize: '12px', color: 'rgb(0,0,0)', backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-2" style={{ ...fontStyle, fontSize: '18px', lineHeight: '24px', fontWeight: 500, color: 'rgb(0,0,0)' }}>
          {title}
        </h3>
        <p style={{ ...fontStyle, fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: 'oklch(0.556 0 0)' }}>
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {CardContent}
      </Link>
    );
  }
  return CardContent;
}
