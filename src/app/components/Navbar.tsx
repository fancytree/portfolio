// 顶部导航栏组件
// 使用方法：在布局组件或页面中直接使用 <Navbar /> 渲染导航栏

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    // 固定在页面顶部的导航栏，宽度占满，固定在屏幕顶部
    <header className="fixed w-full top-0 z-50">
      {/* 绝对定位的背景层，包含渐变模糊效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-lg -z-10"></div>
      
      {/* 导航内容，相对定位以确保在背景之上显示 */}
      <nav 
        className="relative z-10 flex items-center justify-between mx-auto"
        style={{
          height: '72px',
          maxWidth: '1280px',
          width: '100%',
          padding: '24px 48px',
          border: '0px solid transparent'
        }}
      >
        {/* 左侧项目名称 / Logo */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={24} 
            height={24}
            className="object-contain"
          />
          <div 
            className="transition-colors duration-700 text-base font-medium leading-6 h-6 text-center"
            style={{ 
              color: '#000000',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            River
          </div>
        </div>

        {/* 右侧导航链接 */}
        <div className="flex items-center gap-6">
          <Link 
            href="#work" 
            className="transition-colors duration-700 text-base font-medium leading-6 h-6 text-center cursor-pointer"
            style={{ 
              color: '#000000',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Work
          </Link>
          <Link 
            href="#about" 
            className="transition-colors duration-700 text-base font-medium leading-6 h-6 text-center cursor-pointer"
            style={{ 
              color: '#000000',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className="transition-colors duration-700 text-base font-medium leading-6 h-6 text-center cursor-pointer"
            style={{ 
              color: '#000000',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}


