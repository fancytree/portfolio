// Showcase 卡片组件
// 使用方法：<ShowcaseCard title="标题" description="描述" tags={['标签1', '标签2']} href="/projects/xxx" />

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface ShowcaseCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  fullWidth?: boolean; // 是否占满一行（用于奇数个卡片时第一个卡片）
  href?: string; // 项目详情页链接
}

export default function ShowcaseCard({ 
  title, 
  description, 
  tags,
  imageUrl,
  fullWidth = false,
  href
}: ShowcaseCardProps) {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const CardContent = (
    <div 
      className="flex flex-col cursor-pointer group"
      style={fullWidth ? { gridColumn: 'span 2' } : {}}
    >
      {/* 封面图片 */}
      <div
        className="w-full aspect-video bg-gray-300 rounded-t-2xl overflow-hidden mb-4 relative"
        style={{ minHeight: '200px' }}
      >
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        
        {/* 右下角箭头按钮 */}
        <div 
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md"
        >
          <Image
            src="/arrow.svg"
            alt="Arrow"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex flex-col">
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded"
              style={{
                ...fontStyle,
                fontSize: '12px',
                color: 'rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h3
          className="mb-2"
          style={{
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '24px',
            fontWeight: 500,
            color: 'rgb(0, 0, 0)',
          }}
        >
          {title}
        </h3>

        {/* 描述 */}
        <p
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );

  // 如果有 href，使用 Link 包裹；否则直接返回内容
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

