/**
 * Neo-Brutalism Dialog (Modal) Component
 * 기반: /Users/moon/Desktop/neo-brutalism-ui-library-main
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { NeoButton } from './Button';

type ButtonColor = 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';

interface NeoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  width?: 'fit' | 'full' | '1/2' | '1/3';
  cancelButtonText?: string;
  actionButtonText?: string;
  actionButtonColor?: ButtonColor;
  onAction?: () => void;
  className?: string;
}

const widthClasses = {
  fit: 'w-72 md:w-80',
  full: 'w-full max-w-2xl',
  '1/2': 'w-full max-w-md',
  '1/3': 'w-full max-w-sm',
};

export function NeoDialog({
  isOpen,
  onClose,
  message,
  width = 'fit',
  cancelButtonText = '취소',
  actionButtonText = '확인',
  actionButtonColor = 'cyan',
  onAction,
  className,
}: NeoDialogProps) {
  if (!isOpen) return null;

  const handleAction = () => {
    onAction?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'px-8 py-4 bg-white border-4 border-black',
          'shadow-[8px_8px_0px_rgba(0,0,0,1)]',
          'grid place-content-center gap-4',
          widthClasses[width],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center font-bold text-lg">{message}</p>

        <div className="flex gap-2 justify-center">
          <NeoButton
            onClick={onClose}
            color="cyan"
            size="md"
          >
            {cancelButtonText}
          </NeoButton>

          {onAction && (
            <NeoButton
              onClick={handleAction}
              color={actionButtonColor}
              size="md"
            >
              {actionButtonText}
            </NeoButton>
          )}
        </div>
      </div>
    </div>
  );
}
