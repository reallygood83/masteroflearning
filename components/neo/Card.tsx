/**
 * Neo-Brutalism Card Component
 * 기반: /Users/moon/Desktop/neo-brutalism-ui-library-main
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function NeoCard({ children, hover = true, className, ...props }: NeoCardProps) {
  return (
    <div
      className={cn(
        'w-full border-black border-2 rounded-md bg-white',
        hover && 'hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface NeoCardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function NeoCardImage({ src, alt, className, ...props }: NeoCardImageProps) {
  return (
    <figure className="w-full border-black border-b-2">
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', className)}
        {...props}
      />
    </figure>
  );
}

interface NeoCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NeoCardContent({ children, className, ...props }: NeoCardContentProps) {
  return (
    <div className={cn('px-6 py-5 text-left', className)} {...props}>
      {children}
    </div>
  );
}
