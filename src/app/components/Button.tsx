'use client';

// 按钮组件
// 使用方法：
//   <Button onClick={handleClick}>按钮文字</Button> // 默认实心按钮
//   <Button variant="ghost" onClick={handleClick}>按钮文字</Button> // 幽灵按钮

import { useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'ghost'; // 按钮类型：实心或幽灵
}

export default function Button({ 
  children, 
  className = "", 
  variant = 'solid',
  style,
  ...props 
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 基础样式
  const baseStyle = {
    fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
    fontSize: '14px',
    fontStyle: 'normal' as const,
    fontVariant: 'normal' as const,
    fontWeight: 700,
    letterSpacing: 'normal' as const,
    lineHeight: '20px',
    textDecoration: 'none' as const,
    textAlign: 'center' as const,
    height: '50px',
    padding: '14px 24px',
    borderRadius: '999px',
    cursor: 'pointer' as const,
    transition: 'all 0.24s ease',
    boxShadow: '4px 4px 0 #1E1E14',
  };

  // 根据 variant 和 hover 状态应用不同的样式
  const getVariantStyle = () => {
    if (variant === 'ghost') {
      // 幽灵按钮：hover 时变为默认按钮样式
      if (isHovered) {
        return {
          color: 'rgb(255, 255, 255)',
          backgroundColor: '#1E1E14',
          border: '2px solid #1E1E14',
          transform: 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0 #F5A045',
        };
      }
      return {
        color: '#1E1E14',
        backgroundColor: '#FFFFFF',
        border: '2px solid #1E1E14',
      };
    } else {
      // 默认按钮：hover 时变为幽灵按钮样式
      if (isHovered) {
        return {
          color: '#1E1E14',
          backgroundColor: '#F5A045',
          border: '2px solid #1E1E14',
          transform: 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0 #1E1E14',
        };
      }
      return {
        color: '#FFFFFF',
        backgroundColor: '#1E1E14',
        border: '2px solid #1E1E14',
      };
    }
  };

  return (
    <button
      className={`text-center ${className}`}
      style={{
        ...baseStyle,
        ...getVariantStyle(),
        ...style, // 合并传入的 style，允许覆盖或扩展默认样式
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
