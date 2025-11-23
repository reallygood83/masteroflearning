/**
 * Neo-Brutalism Button Component
 * 기반: /Users/moon/Desktop/neo-brutalism-ui-library-main
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonColor = 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRounded = 'none' | 'md' | 'full';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  children?: React.ReactNode;
}

const colorClasses: Record<ButtonColor, string> = {
  violet: 'bg-violet-200 hover:bg-violet-300 active:bg-violet-400',
  pink: 'bg-pink-200 hover:bg-pink-300 active:bg-pink-400',
  red: 'bg-red-200 hover:bg-red-300 active:bg-red-400',
  orange: 'bg-orange-200 hover:bg-orange-300 active:bg-orange-400',
  yellow: 'bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-400',
  lime: 'bg-lime-200 hover:bg-lime-300 active:bg-lime-400',
  cyan: 'bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
  md: 'h-12 px-5 text-base hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
  lg: 'h-14 px-5 text-lg hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]',
};

const roundedClasses: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  md: 'rounded-md',
  full: 'rounded-full',
};

export function NeoButton({
  buttonText,
  color = 'cyan',
  size = 'md',
  rounded = 'md',
  disabled = false,
  className,
  children,
  ...props
}: NeoButtonProps) {
  return (
    <button
      className={cn(
        // 기본 스타일
        'border-black border-2 font-bold transition-all duration-200',
        'hover:translate-x-[2px] hover:translate-y-[2px]',
        'active:translate-x-[4px] active:translate-y-[4px]',
        // 색상
        !disabled && colorClasses[color],
        // 크기
        sizeClasses[size],
        // 둥글기
        roundedClasses[rounded],
        // Disabled 상태
        disabled && 'border-[#727272] bg-[#D4D4D4] text-[#676767] hover:shadow-none cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children || buttonText}
    </button>
  );
}
