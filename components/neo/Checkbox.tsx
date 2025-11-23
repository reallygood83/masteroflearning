/**
 * Neo-Brutalism Checkbox Component
 * 기반: /Users/moon/Desktop/neo-brutalism-ui-library-main
 */

import React from 'react';
import { cn } from '@/lib/utils';

type CheckboxColor = 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';

interface NeoCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'lg';
  color?: CheckboxColor;
  label?: string;
}

const colorClasses: Record<CheckboxColor, string> = {
  violet: 'before:bg-violet-200 checked:before:bg-violet-300',
  pink: 'before:bg-pink-200 checked:before:bg-pink-300',
  red: 'before:bg-red-200 checked:before:bg-red-300',
  orange: 'before:bg-orange-200 checked:before:bg-orange-300',
  yellow: 'before:bg-yellow-200 checked:before:bg-yellow-300',
  lime: 'before:bg-lime-200 checked:before:bg-lime-300',
  cyan: 'before:bg-cyan-200 checked:before:bg-cyan-300',
};

const sizeClasses = {
  sm: {
    container: 'w-5 h-5',
    before: 'before:w-5 before:h-5',
    after: 'after:w-1 after:h-3 after:left-[7px] after:top-[2px]',
  },
  lg: {
    container: 'w-10 h-10',
    before: 'before:w-8 before:h-8 before:left-1 before:top-1',
    after: 'after:w-2 after:h-6 after:left-[14px] after:top-[4px]',
  },
};

export function NeoCheckbox({
  size = 'sm',
  color = 'cyan',
  label,
  className,
  disabled = false,
  ...props
}: NeoCheckboxProps) {
  const id = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        className={cn(
          'appearance-none outline-none cursor-pointer relative',
          // Before pseudo (checkbox box)
          'before:content-[""] before:absolute before:rounded-sm',
          'before:border-black before:border-2',
          'before:hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
          'before:transition-all before:duration-200',
          // After pseudo (checkmark)
          'after:content-[""] after:absolute after:hidden',
          'after:border-black after:border-r-2 after:border-b-2',
          'after:rotate-45',
          'checked:after:block',
          // Size classes
          sizeClasses[size].container,
          sizeClasses[size].before,
          sizeClasses[size].after,
          // Color classes
          !disabled && colorClasses[color],
          // Disabled state
          disabled && 'cursor-not-allowed opacity-50 before:bg-[#D4D4D4] before:border-[#727272]',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'font-bold cursor-pointer select-none',
            disabled && 'text-[#676767] cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
