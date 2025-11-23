/**
 * 메인 홈페이지 (한국어 기본)
 * Neo-Brutalism Design System
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (user) {
      router.push('/ko/news');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">AI EDU NEWS</h1>
          </div>
          <nav className="flex items-center gap-4">
            {loading ? (
              <div className="px-6 py-2 font-bold text-gray-400">
                로딩 중...
              </div>
            ) : user ? (
              <>
                <Link
                  href="/ko/news"
                  className="px-4 py-2 font-bold hover:underline"
                >
                  뉴스
                </Link>
                <Link
                  href="/ko/dashboard"
                  className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 px-4 py-2 font-bold"
                >
                  대시보드
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 px-6 py-2 font-bold"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-3 mb-8 rotate-[-2deg]">
            <p className="text-lg font-black">🚀 AI 교육의 미래가 여기에!</p>
          </div>

          <h2 className="text-6xl font-black mb-6 leading-tight">
            최신 AI 교육 뉴스를
            <br />
            <span className="bg-yellow-300 px-4">쉽게 이해하세요</span>
          </h2>

          <p className="text-xl font-bold text-gray-800 mb-12 max-w-2xl mx-auto">
            복잡한 AI 뉴스를 파인만 기법으로 풀어드립니다.
            <br />
            누구나 이해할 수 있는 쉬운 설명과 함께!
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleGetStarted}
              className="bg-blue-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 px-8 py-4 font-black text-lg flex items-center gap-2"
            >
              시작하기 <ArrowRight className="w-6 h-6" />
            </button>
            <Link
              href="#features"
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 px-8 py-4 font-black text-lg"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-black text-center mb-12">
          왜 AI EDU NEWS인가요?
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-4xl mb-4">
              <BookOpen className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-black mb-3">쉬운 설명</h4>
            <p className="font-bold text-gray-800">
              파인만 기법으로 복잡한 AI 개념을 누구나 이해할 수 있게 풀어드립니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-pink-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-4xl mb-4">
              <Sparkles className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-black mb-3">AI 요약</h4>
            <p className="font-bold text-gray-800">
              xAI Grok이 최신 뉴스를 자동으로 분석하고 핵심만 추출합니다.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-4xl mb-4">
              <Users className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-black mb-3">맞춤형 뉴스레터</h4>
            <p className="font-bold text-gray-800">
              관심 분야에 맞는 AI 교육 뉴스를 이메일로 받아보세요.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-green-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="text-4xl mb-4">
              <TrendingUp className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-black mb-3">트렌드 분석</h4>
            <p className="font-bold text-gray-800">
              AI 교육의 최신 트렌드와 미래 전망을 한눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
          <h3 className="text-4xl font-black mb-6">
            지금 바로 시작하세요!
          </h3>
          <p className="text-xl font-bold text-gray-700 mb-8">
            AI 교육의 최신 소식을 가장 쉽게 받아보는 방법
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-pink-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 px-12 py-4 font-black text-xl"
          >
            무료로 시작하기 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h4 className="text-xl font-black">AI EDU NEWS</h4>
              </div>
              <p className="font-bold text-gray-700">
                AI 교육 뉴스를 쉽게 이해하는 플랫폼
              </p>
            </div>
            <div>
              <h5 className="font-black mb-4">링크</h5>
              <ul className="space-y-2 font-bold">
                <li><Link href="/ko/news" className="hover:underline">뉴스</Link></li>
                <li><Link href="/ko/about" className="hover:underline">소개</Link></li>
                <li><Link href="/ko/contact" className="hover:underline">문의</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black mb-4">법적 고지</h5>
              <ul className="space-y-2 font-bold">
                <li><Link href="/ko/privacy" className="hover:underline">개인정보처리방침</Link></li>
                <li><Link href="/ko/terms" className="hover:underline">이용약관</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-4 border-black text-center font-bold">
            <p>© 2025 AI EDU NEWS. Powered by xAI Grok.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
