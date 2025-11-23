/**
 * 로그인 페이지 (Firebase Google OAuth)
 * Neo-Brutalism Design System
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push(callbackUrl);
    } catch (error) {
      console.error('로그인 오류:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 p-4">
      <div className="w-full max-w-md">
        {/* 로그인 카드 - Neo-Brutalism 스타일 */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* 로고 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black mb-2">🤖</h1>
            <h2 className="text-3xl font-black mb-2">AI EDU NEWS</h2>
            <p className="text-lg font-bold text-gray-700">
              AI 교육 뉴스 플랫폼
            </p>
          </div>

          {/* 설명 */}
          <div className="bg-yellow-100 border-4 border-black p-4 mb-6">
            <p className="font-bold text-center">
              ✨ Google 계정으로 간편하게 시작하세요
            </p>
          </div>

          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-4 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                로그인 중...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 로그인
              </>
            )}
          </button>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-blue-100 border-4 border-black">
            <p className="text-sm font-bold text-center">
              📧 로그인하면 뉴스레터 구독과 <br />
              맞춤형 AI 교육 뉴스를 받아볼 수 있습니다.
            </p>
          </div>

          {/* 이용약관 */}
          <p className="text-xs text-gray-600 text-center mt-6 font-bold">
            로그인 시 <span className="underline">이용약관</span> 및{' '}
            <span className="underline">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-block bg-pink-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 px-6 py-3 font-bold"
          >
            🏠 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
