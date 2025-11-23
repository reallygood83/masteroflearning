/**
 * 인증 필요 컴포넌트
 * - 로그인 여부 확인
 * - 관리자 권한 확인
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 로그인하지 않은 경우
      if (!user) {
        router.push('/auth/login?callbackUrl=' + window.location.pathname);
        return;
      }

      // 관리자 권한이 필요한데 관리자가 아닌 경우
      if (requireAdmin && !isAdmin) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, userProfile, loading, isAdmin, requireAdmin, router]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 중)
  if (!user) {
    return null;
  }

  // 관리자 권한이 필요한데 관리자가 아닌 경우 (리다이렉트 중)
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // 인증 성공
  return <>{children}</>;
}
