/**
 * 로그인 페이지 (Firebase Google OAuth)
 * Neo-Brutalism Design System
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import GoogleLoginButton from '@/app/components/GoogleLoginButton';

function LoginForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

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
          <GoogleLoginButton />

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
        <div className="text-4xl font-black">로딩 중...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
