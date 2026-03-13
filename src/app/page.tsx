'use client';

import { useState, useRef, useEffect } from 'react';
import Button from './components/Button';
import ShowcaseCard from './components/ShowcaseCard';
import Image from 'next/image';

// 自定义 hook：检测元素是否进入视口并触发动画
function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 对于初始就在视口内的元素（如 hero），添加一个延迟以确保动画可见
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // 一旦触发，就不再观察，避免重复触发
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1, // 当元素 10% 可见时触发
          rootMargin: '0px 0px -100px 0px', // 提前 100px 触发
        }
      );

      if (ref.current) {
        // 检查元素是否已经在视口内
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // 如果已经在视口内，直接触发动画
          setIsVisible(true);
        } else {
          // 否则开始观察
          observer.observe(ref.current);
        }
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, initialDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [initialDelay]);

  return { ref, isVisible };
}

// ScrollAnimatedSection 组件：包装内容并应用滚动动画
function ScrollAnimatedSection({ children, initialDelay = 0 }: { children: React.ReactNode; initialDelay?: number }) {
  const { ref, isVisible } = useScrollAnimation(initialDelay);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// ToolTab 组件
function ToolTab({ tool }: { tool: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...fontStyle,
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '24px',
        height: '48px',
        padding: '0 24px',
        borderRadius: '29px',
        color: 'rgb(0, 0, 0)',
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: isHovered ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {tool}
    </button>
  );
}

// HighlightedText 组件 - 关键字强调效果
function HighlightedText({ children }: { children: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const letters = children.split('');

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getLetterStyle = (index: number) => {
    if (!isHovered || !containerRef.current) {
      return {
        display: 'inline-block',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    const letterElement = containerRef.current.children[index] as HTMLElement;
    if (!letterElement) {
      return {
        display: 'inline-block',
        transition: 'all 0.1s ease-out',
      };
    }

    const letterRect = letterElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const letterCenterX = letterRect.left - containerRect.left + letterRect.width / 2;
    const letterCenterY = letterRect.top - containerRect.top + letterRect.height / 2;
    
    const dx = mousePosition.x - letterCenterX;
    const dy = mousePosition.y - letterCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 根据距离计算缩放和位移
    const maxDistance = 80; // 影响范围
    const maxScale = 1.3; // 最大缩放
    const maxOffset = 4; // 最大位移
    
    if (distance === 0) {
      return {
        display: 'inline-block',
        transform: `scale(${maxScale})`,
        transition: 'all 0.1s ease-out',
      };
    }
    
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const scale = 1 + (maxScale - 1) * (1 - normalizedDistance);
    const offsetX = (dx / distance) * maxOffset * (1 - normalizedDistance);
    const offsetY = (dy / distance) * maxOffset * (1 - normalizedDistance);
    
    return {
      display: 'inline-block',
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      transition: 'all 0.1s ease-out',
    };
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        display: 'inline-block',
        cursor: 'default',
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={getLetterStyle(index)}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
}

// ContactCard 组件
function ContactCard({
  iconSrc,
  iconAlt,
  title,
  content,
  onClick,
}: {
  iconSrc: string;
  iconAlt: string;
  title: string;
  content: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transitionDelay: isHovered ? '0.3s' : '0s',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 6px 10px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: isHovered ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: isHovered ? '0.1s' : '0s',
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={20}
          height={20}
          style={{ 
            filter: isHovered ? 'brightness(0) invert(1)' : 'brightness(0)',
            transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: isHovered ? '0.1s' : '0s',
          }}
        />
      </div>
      <div className="flex flex-col">
        <h3
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 700,
            color: 'rgb(0, 0, 0)',
            marginBottom: '4px',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            ...fontStyle,
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 400,
            color: 'rgb(0, 0, 0)',
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  // 共享的字体样式
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // 鼠标位置和 hover 状态
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  // 手风琴展开状态 - 一次只展开一个
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  // 存储每个列表项的展开方向
  const [expandDirections, setExpandDirections] = useState<{ [key: number]: 'up' | 'down' }>({});
  
  // 列表项 refs
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 获取展开方向（根据列表项在视口中的位置）
  const getExpandDirection = (index: number): 'up' | 'down' => {
    // 如果已经计算过方向，直接返回
    if (expandDirections[index]) {
      return expandDirections[index];
    }
    
    const item = itemRefs.current[index];
    if (!item) return 'down';
    
    const rect = item.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const itemCenterY = rect.top + rect.height / 2;
    
    // 如果列表项的中心在视口的上半部分，向上展开；否则向下展开
    const direction = itemCenterY < viewportHeight / 2 ? 'up' : 'down';
    
    // 存储计算的方向
    setExpandDirections(prev => ({ ...prev, [index]: direction }));
    
    return direction;
  };

  // 切换手风琴项 - 手风琴效果：一次只展开一个
  const toggleAccordion = (index: number) => {
    // 在切换前计算并存储展开方向
    const direction = getExpandDirection(index);
    setExpandDirections(prev => ({ ...prev, [index]: direction }));
    
    setExpandedItem(prev => prev === index ? null : index);
  };

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!textRef.current) return;
    
    const rect = textRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  // 生成渐变样式（使用 mask 实现，保持文字可见）
  const getGradientStyle = () => {
    if (!isHovered) return {};
    
    const { x, y } = mousePosition;
    const gradientSize = 300; // 渐变范围大小
    
    return {
      backgroundImage: `radial-gradient(circle ${gradientSize}px at ${x}px ${y}px, 
        #3771D9 0%, 
        #3771D9 25%, 
        #5555c0 45%, 
        transparent 65%)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'background-image 0.1s ease-out',
    };
  };

  return (
    <>
    <section 
      id="hero"
      className="min-h-screen flex items-center justify-center transition-colors duration-700 w-screen"
      style={{
        ...fontStyle,
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        color: 'oklch(0.145 0 0)',
        minHeight: 'calc(100vh - 80px)', // 减去 Layout main 的 pt-20 (80px)，确保 Hero 占满剩余视口
        padding: '0 48px',
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection initialDelay={200}>
        {/* Hero 内容区域：分为 3 部分 */}
        <div
          className="flex flex-col transition-colors duration-700"
          style={{
            ...fontStyle,
            fontSize: '16px',
            lineHeight: '24px',
            color: 'oklch(0.145 0 0)',
            height: '399.984px',
            maxWidth: '1152px',
            width: '100%',
            margin: '0 auto',
          }}
        >
        {/* 第一部分：标题描述 */}
        <p
          className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors duration-700 w-full"
          style={{
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '32.4px',
            color: 'oklch(0.439 0 0)',
            marginBottom: '24px',
            maxWidth: '1152px',
            height: '32.3984px',
          }}
        >
          UX Designer · Creative Technologist
        </p>

        {/* 第二部分：主标题（包含两句话，带鼠标跟随渐变效果） */}
        <span
          ref={textRef}
          className="block cursor-pointer relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...fontStyle,
            fontSize: '72px',
            fontWeight: 400,
            letterSpacing: '-1.8px',
            lineHeight: '79.2px',
            transform: 'none',
            transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), fill 0.7s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* 原始文字层 */}
          <span className="relative z-0">
            <span
              style={{
                color: 'rgb(0, 0, 0)',
                transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Turning user research and testing into meaningful, user-centered solutions.{' '}
            </span>
            <span
              style={{
                color: 'oklch(0.556 0 0)',
                transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Let's make technology feel more human, together.
            </span>
          </span>
          {/* 渐变覆盖层（覆盖两句话，但第二句话保持透明以显示底层灰色） */}
          <span
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-10"
            style={getGradientStyle()}
          >
            Turning user research and testing into meaningful, user-centered solutions.{' '}
            <span style={{ WebkitTextFillColor: 'transparent', color: 'transparent' }}>
              Let's make technology feel more human, together.
            </span>
          </span>
        </span>

        {/* 第三部分：三个并列的按钮 */}
        <div className="flex items-center gap-4 mt-8">
          <Button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const target = document.getElementById('work');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
          >
            View case study
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              // 在新标签页打开简历 PDF，浏览器中可直接下载
              if (typeof window !== 'undefined') {
                window.open('/MeiChai_UX%20designer.pdf', '_blank');
              }
            }}
          >
            View resume
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'mailto:flyskytoo@outlook.com';
              }
            }}
          >
            contact
          </Button>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>
    {/* Selected Work 部分 */}
    <section 
      id="work"
      className="w-screen py-16"
      style={{
        paddingBottom: '80px',
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '22px',
            lineHeight: '32px',
            fontWeight: 400,
            marginBottom: '8px',
          }}
        >
          Selected Work
        </h2>

        {/* 描述文字 */}
        <p
          style={{
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '32px',
            fontWeight: 400,
            marginBottom: '32px',
            color: 'oklch(0.556 0 0)', // 与 hero 区域第二部分灰色文字颜色一致
          }}
        >
          Case studies showcasing user-centered design, technical implementation, and creative problem-solving.
        </p>

        {/* Showcase 卡片区域 */}
        <div className="flex flex-col gap-10">
          {/* 第一列：Jobnova 单独展示 */}
          <ShowcaseCard
            title="Jobnova"
            description="An AI-native career ecosystem for job seekers to discover tailored opportunities and automate applications with hyper-personalized resumes."
            tags={['Product Design', 'AI', 'Career Tech', '0-to-1']}
            imageUrl="/img/Jobnova_cover.png"
            href="/projects/jobnova"
          />

          {/* 其余项目：两列网格展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-12">
            <ShowcaseCard
              title="MemQ: Smart Quiz & Memory APP"
              description="A streamlined mobile learning experience designed for lifelong learners to capture knowledge and master subjects through custom flashcards and quizzes."
              tags={['Mobile App', 'UX Design', 'Learning']}
              imageUrl="/img/cover image.png"
              href="/projects/memq"
            />
            <ShowcaseCard
              title="Mono: Autonomous Interface Generation via LLM-to-JSON Orchestration"
              description="The Intent-Driven Generative UI Financial Agent — conversational AI that helps users manage finances through natural language and dynamic, context-aware interfaces."
              tags={['Product Design', 'Generative UI', 'Financial AI']}
              href="/projects/mono"
              imageUrl="/img/mono_cover.png"
            />
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Approach 部分 */}
    <section 
      className="w-screen py-16"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '48px',
          }}
        >
          Approach
        </h2>

        {/* 内容文字容器 */}
        <div
          style={{
            maxWidth: '900px',
          }}
        >
          <p
            style={{
              ...fontStyle,
              fontSize: '60px',
              lineHeight: '75px',
              fontWeight: 400,
              color: 'rgb(0, 0, 0)', // 黑色
              textAlign: 'left',
            }}
          >
            Explore my process of transforming <HighlightedText>insights</HighlightedText> into impact. Dive into stories of <HighlightedText>user-centered</HighlightedText> design where <HighlightedText>strategic thinking</HighlightedText> meets <HighlightedText>technical precision</HighlightedText>.
          </p>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* What I Do 部分 */}
    <section 
      className="w-screen py-16"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '48px',
          }}
        >
          What I Do
        </h2>

        {/* 手风琴列表 */}
        <div className="flex flex-col" style={{ gap: '48px' }}>
          {/* 第一条 */}
          <div 
            ref={(el) => { itemRefs.current[0] = el; }}
            className="relative"
          >
            <button
              onClick={() => toggleAccordion(0)}
              className="w-full flex items-center justify-between text-left relative"
              style={{ height: '104px' }}
            >
              <div className="flex items-center gap-4">
                {/* 图标容器 */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '16px',
                  }}
                >
                  <Image
                    src="/UX.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                    style={{ filter: 'brightness(0)' }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '36px',
                    lineHeight: '40px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                  }}
                >
                  UX/UI designer
                </h3>
              </div>
            <Image
                src="/expand.svg"
                alt="Expand"
                width={32}
                height={32}
                className={`transition-transform flex-shrink-0 ${expandedItem === 0 ? 'rotate-180' : ''}`}
                style={{ marginLeft: '16px', transitionDuration: '400ms' }}
              />
            </button>
            {/* 内容区域 */}
            <div 
              className="overflow-hidden transition-all ease-in-out"
              style={{ 
                maxHeight: expandedItem === 0 ? '1000px' : '0px',
                paddingLeft: '72px',
                maxWidth: '828px',
                transitionDuration: '400ms'
              }}
            >
              <div className="pb-6">
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 500,
                    color: 'oklch(0.556 0 0)',
                  }}
                >
                  User-centered design focused on creating intuitive interfaces that solve real problems. From wireframes to high-fidelity prototypes, I craft experiences that balance aesthetics with functionality.
                </p>
              </div>
            </div>
            {/* 分割线 */}
            <div 
              style={{ 
                height: '16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* 第二条 */}
          <div 
            ref={(el) => { itemRefs.current[1] = el; }}
            className="relative"
          >
            <button
              onClick={() => toggleAccordion(1)}
              className="w-full flex items-center justify-between text-left relative"
              style={{ height: '104px' }}
            >
              <div className="flex items-center gap-4">
                {/* 图标容器 */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '16px',
                  }}
                >
                  <Image
                    src="/AI.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                    style={{ filter: 'brightness(0)' }}
                  />
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '36px',
                    lineHeight: '40px',
                    fontWeight: 500,
                    color: 'rgb(0, 0, 0)',
                  }}
                >
                  AI & Conversation designer
                </h3>
              </div>
              <Image
                src="/expand.svg"
                alt="Expand"
                width={32}
                height={32}
                className={`transition-transform flex-shrink-0 ${expandedItem === 1 ? 'rotate-180' : ''}`}
                style={{ marginLeft: '16px', transitionDuration: '400ms' }}
              />
            </button>
            {/* 内容区域 */}
            <div 
              className="overflow-hidden transition-all ease-in-out"
              style={{ 
                maxHeight: expandedItem === 1 ? '1000px' : '0px',
                paddingLeft: '72px',
                maxWidth: '828px',
                transitionDuration: '400ms'
              }}
            >
              <div className="pb-6">
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 500,
                    color: 'oklch(0.556 0 0)',
                  }}
                >
                  I design AI assistants that feel like part of the product, not a gimmick. I map conversations and connect large language models to real product data so people get clearer, faster answers. On this site, that's the AI chat in the corner—ask it about my work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Tools & Technologies 部分 */}
    <section 
      className="w-screen py-16"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '48px',
          }}
        >
          Tools & Technologies
        </h2>

        {/* Tab 列表 */}
        <div 
          className="flex flex-wrap"
          style={{ maxWidth: '900px', gap: '14px' }}
        >
          {[
            'Figma',
            'ProtoPie',
            'Maze',
            'Miro',
            'Dify & Coze',
            'Python',
            'Supabase',
            'Principle',
            'HTML/CSS',
            'Design Systems',
            'ComfyUI',
            'Arduino',
            'TouchDesigner',
            'GitHub',
            'Unity'
          ].map((tool, index) => (
            <ToolTab key={index} tool={tool} />
          ))}
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Other Works 部分 */}
    <section 
      className="w-screen py-16"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          {/* 标题 */}
          <h2
            style={{
              ...fontStyle,
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              marginBottom: '32px',
            }}
          >
            Other Works
          </h2>

          {/* 作品卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. CrackInterview.AI · 2025 */}
            <a
              href="/projects/crackinterview"
              className="other-work-card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '16 / 9',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/img/CrackInterview_cover.avif"
                  alt="CrackInterview cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '0px',
                }}
              >
                CrackInterview.AI
              </h3>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '18px',
                }}
              >
                Lead Product Designer · AI Interview Platform · 2025
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '12px',
                }}
              >
                AI mock tech interviews with structured feedback to help candidates improve.
              </p>
              <span
                className="case-study-hint"
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>

            {/* 2. Clarity · 2024 */}
            <a
              href="/projects/clarity"
              className="other-work-card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/img/Clarity.avif"
                  alt="Clarity"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '0px',
                }}
              >
                Clarity
              </h3>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '18px',
                }}
              >
                Product Design · Digital Health · 2024
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '12px',
                }}
              >
                App and device for menopause symptom tracking, insights, and better communication with healthcare providers.
              </p>
              <span
                className="case-study-hint"
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>

            {/* 3. Milano Partecipa · 2023 */}
            <a
              href="/projects/milano-partecipa"
              className="other-work-card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/img/Milano%20Partecipa.avif"
                  alt="Milano Partecipa"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '0px',
                }}
              >
                Milano Partecipa
              </h3>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '18px',
                }}
              >
                Service &amp; UX Designer · Civic Participation · 2023
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '12px',
                }}
              >
                Civic participation platform for Milan.
              </p>
              <span
                className="case-study-hint"
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>

            {/* 4. Integrated Chat and Customer Service System · 2022 */}
            <a
              href="/projects/customer-service-system"
              className="other-work-card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '16 / 9',
                  marginBottom: '16px',
                }}
              >
                <Image
                  src="/img/customer-service-system/customer-service-system.png"
                  alt="Customer Service System cover"
                  width={800}
                  height={450}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '0px',
                }}
              >
                Integrated Chat and Customer Service System
              </h3>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '18px',
                }}
              >
                UX &amp; Service Designer · End-to-end Service Experience · 2022
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '12px',
                }}
              >
                Multi-role chat platform for users, promoters, and support—with admin and service workflows.
              </p>
              <span
                className="case-study-hint"
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>

            {/* 5. Beikemama · 2020 */}
            <a
              href="/projects/beikemama"
              className="other-work-card"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/img/Beikemama.png"
                  alt="Beikemama"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '24px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '0px',
                }}
              >
                Beikemama
              </h3>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '12px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'oklch(0.556 0 0)',
                  marginBottom: '18px',
                }}
              >
                Product &amp; UX Designer · Live Parenting Community · 2020
              </p>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '12px',
                }}
              >
                Live social platform for pregnant women and young families, combining expert Q&amp;A, interactive streams, and supportive parenting communities.
              </p>
              <span
                className="case-study-hint"
                style={{
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </ScrollAnimatedSection>
    </section>

    {/* About 部分 */}
    <section 
      id="about"
      className="w-screen"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: '240px',
        paddingBottom: '240px',
      }}
    >
      <ScrollAnimatedSection>
        <div
        className="flex flex-col w-full"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '28px',
            lineHeight: '36px',
            fontWeight: 500,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '80px',
          }}
        >
          About
        </h2>

        {/* 副标题和正文段落整体 */}
        <div style={{ marginBottom: '80px' }}>
          {/* 副标题 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '22px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '24px',
            }}
          >
            Solving complex problems through intuitive logic and human-centered design.
          </p>

          {/* 正文段落 */}
          <div className="flex flex-col gap-6">
            <p
              style={{
                ...fontStyle,
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
              }}
            >
              I am a UX Designer and Creative Technologist dedicated to transforming intricate technical challenges into seamless, high-integrity digital experiences. My design philosophy is built on the belief that technology should empower people, not intimidate them. I thrive at the intersection of analytical rigor and creative exploration—deconstructing technically dense environments to find the path that makes the most sense for the human at the other end of the screen.
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
              }}
            >
              I approach design with a focus on empowerment through clarity. I don't just design interfaces; I design for the feeling of agency—that moment when a product works so intuitively that the user feels inherently capable. My goal is to build digital products that are as robust in their logic as they are effortless in their use, ensuring that even the most sophisticated systems feel accessible and human.
            </p>
          </div>
        </div>

        {/* 四列内容 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Strategy & Research */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Strategy &amp; Research
            </h3>
            <div className="flex flex-col gap-1">
              <p
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  margin: 0,
                }}
              >
                User Research
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Data Analysis
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Usability Testing
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Information Architecture
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Content Design
              </p>
            </div>
          </div>

          {/* UX/UI Design */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              UX/UI Design
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Interaction Design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Design Systems
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Wireframing
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Prototyping
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Accessibility (WCAG)
              </p>
            </div>
          </div>

          {/* Tech & Specialized */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Tech &amp; Specialized
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Agentic Design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Conversational UX
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                AR/VR
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Rapid Prototyping (Vibe Coding, MCP)
              </p>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Tools
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Figma
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Protopie
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Adobe Creative Suite
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Dify &amp; Coze
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                ComfyU
              </p>
            </div>
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Get in Touch 部分 */}
    <section 
      id="contact"
      className="w-screen"
      style={{
        backgroundColor: '#FAFAFA',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: '240px',
        paddingBottom: '240px',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '28px',
            lineHeight: '36px',
            fontWeight: 500,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '80px',
          }}
        >
          Get in Touch
        </h2>

        {/* 副标题和正文段落整体 */}
        <div style={{ marginBottom: '80px' }}>
          {/* 副标题 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '22px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '24px',
            }}
          >
            Let's create something meaningful together
          </p>

          {/* 正文段落 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '28px',
              fontWeight: 400,
              color: 'rgb(0, 0, 0)',
            }}
          >
            I'm always interested in new opportunities, collaborations, and conversations about UX research, design, and creative technology. Whether you're looking for a UX designer, need help with usability testing, or want to explore AR experiences, I'd love to hear from you.
          </p>
        </div>

        {/* 三个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            iconSrc="/Mail.svg"
            iconAlt="Email"
            title="Email"
            content="Send a message"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'mailto:flyskytoo@outlook.com';
              }
            }}
          />
          <ContactCard
            iconSrc="/LinkedIN.svg"
            iconAlt="LinkedIn"
            title="LinkedIn"
            content="Contact"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open('https://www.linkedin.com/in/meichai/', '_blank', 'noopener,noreferrer');
              }
            }}
          />
          <ContactCard
            iconSrc="/Github.svg"
            iconAlt="GitHub"
            title="GitHub"
            content="Check my Profile"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open('https://github.com/fancytree', '_blank', 'noopener,noreferrer');
              }
            }}
          />
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Let's work together 部分 */}
    <section 
      className="w-screen"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col items-center w-full"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
        {/* 大标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '60px',
            lineHeight: '75px',
            fontWeight: 400,
            color: 'rgb(0, 0, 0)',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Let's work together
        </h2>

        {/* 按钮 */}
        <div style={{ marginBottom: '240px' }}>
          <Button>
            Work with me
          </Button>
        </div>

        {/* 分割线 */}
        <div 
          style={{ 
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginBottom: '48px',
          }}
        />

        {/* 版权信息 */}
        <p
          style={{
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '32px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)',
            textAlign: 'center',
          }}
        >
          © 2025 Mei Chai. Designed with intention.
        </p>
    </div>
      </ScrollAnimatedSection>
    </section>
    </>
  );
}
