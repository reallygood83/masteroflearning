/**
 * Neo-Brutalism Input Component
 * 기반: /Users/moon/Desktop/neo-brutalism-ui-library-main
 */

import React from 'react';
import { cn } from '@/lib/utils';

type FocusColor = 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focusColor?: FocusColor;
  rounded?: 'none' | 'md' | 'full';
}

const focusColorClasses: Record<FocusColor, string> = {
  violet: 'focus:bg-violet-200',
  pink: 'focus:bg-pink-200',
  red: 'focus:bg-red-200',
  orange: 'focus:bg-orange-200',
  yellow: 'focus:bg-yellow-200',
  lime: 'focus:bg-lime-200',
  cyan: 'focus:bg-cyan-200',
};

const roundedClasses = {
  none: 'rounded-none',
  md: 'rounded-md',
  full: 'rounded-full',
};

export function NeoInput({
  focusColor = 'cyan',
  rounded = 'md',
  className,
  disabled = false,
  ...props
}: NeoInputProps) {
  return (
    <input
      disabled={disabled}
      className={cn(
        'w-72 md:w-full max-w-md border-black border-2 p-2.5',
        'focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
        'active:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
        'focus:placeholder:text-slate-500',
        'transition-all duration-200',
        !disabled && focusColorClasses[focusColor],
        roundedClasses[rounded],
        disabled && 'border-[#727272] bg-[#D4D4D4] text-[#676767] cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
