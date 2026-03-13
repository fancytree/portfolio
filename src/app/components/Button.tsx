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
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    fontStyle: 'normal' as const,
    fontVariant: 'normal' as const,
    fontWeight: 500,
    letterSpacing: 'normal' as const,
    lineHeight: '24px',
    textDecoration: 'none' as const,
    textAlign: 'center' as const,
    height: '58px',
    padding: '16px 32px',
    borderRadius: '29px', // Pill Button: 高度的一半 (58px / 2 = 29px)
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease-in-out', // 平滑过渡动画
  };

  // 根据 variant 和 hover 状态应用不同的样式
  const getVariantStyle = () => {
    if (variant === 'ghost') {
      // 幽灵按钮：hover 时变为默认按钮样式
      if (isHovered) {
        return {
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(0, 0, 0)',
          border: '1px solid rgb(0, 0, 0)',
        };
      }
      return {
        color: 'rgb(0, 0, 0)',
        backgroundColor: 'transparent',
        border: '1px solid rgb(0, 0, 0)',
      };
    } else {
      // 默认按钮：hover 时变为幽灵按钮样式
      if (isHovered) {
        return {
          color: 'rgb(0, 0, 0)',
          backgroundColor: 'transparent',
          border: '1px solid rgb(0, 0, 0)',
        };
      }
      return {
        color: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(0, 0, 0)',
        border: '1px solid transparent',
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

