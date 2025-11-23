/**
 * Client-side Providers
 * - Firebase AuthProvider
 * - 클라이언트 컴포넌트에서 인증 상태 접근 가능
 */

'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
