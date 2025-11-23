/**
 * 플랫폼 소개 페이지
 * Neo-Brutalism 디자인 적용
 */

'use client';

import Link from 'next/link';
import { Brain, Target, Zap, Users, TrendingUp, Shield, ArrowLeft, Sparkles } from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-cyan-300 to-lime-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/ko" className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">AI EDU NEWS</h1>
          </Link>
          <Link
            href="/ko"
            className="px-4 py-2 bg-violet-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-3 bg-cyan-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              플랫폼 소개
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            AI 교육의 미래를<br />함께 만들어갑니다 🚀
          </h2>
          <p className="text-xl font-bold text-gray-800 max-w-2xl mx-auto">
            복잡한 AI 교육 트렌드를 누구나 이해할 수 있게,
            <br />파인만 기법으로 쉽고 명확하게 전달합니다
          </p>
        </div>

        {/* 비전 섹션 */}
        <section className="mb-16">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-4xl font-black mb-6 text-center">우리의 비전 🎯</h3>
            <p className="text-lg font-bold text-center mb-8">
              "모든 교육자와 학습자가 AI 교육의 최신 트렌드를 쉽게 이해하고 활용할 수 있는 세상"
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-lime-100 border-2 border-black p-6 text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h4 className="font-black mb-2">교육의 민주화</h4>
                <p className="font-bold text-sm">
                  누구나 접근 가능한 AI 교육 정보
                </p>
              </div>
              <div className="bg-cyan-100 border-2 border-black p-6 text-center">
                <div className="text-4xl mb-3">💡</div>
                <h4 className="font-black mb-2">쉬운 이해</h4>
                <p className="font-bold text-sm">
                  파인만 기법으로 복잡함을 단순하게
                </p>
              </div>
              <div className="bg-pink-100 border-2 border-black p-6 text-center">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-black mb-2">글로벌 커뮤니티</h4>
                <p className="font-bold text-sm">
                  함께 배우고 성장하는 학습 공간
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 기능 */}
        <section className="mb-16">
          <h3 className="text-4xl font-black text-center mb-12">
            왜 AI EDU NEWS인가? 💡
          </h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* 기능 1 */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
              <div className="bg-pink-200 w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black mb-3">파인만 기법 설명</h4>
              <p className="font-bold text-gray-800 mb-4">
                노벨상 수상자 리처드 파인만의 학습 방법을 적용하여,
                복잡한 AI 개념을 비유와 예시로 쉽게 설명합니다.
              </p>
              <div className="bg-pink-100 border-2 border-black p-4">
                <p className="font-black text-sm">✅ 일상적인 언어 사용</p>
                <p className="font-black text-sm">✅ 구체적인 예시 제공</p>
                <p className="font-black text-sm">✅ 단계별 이해 도움</p>
              </div>
            </div>

            {/* 기능 2 */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
              <div className="bg-cyan-200 w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black mb-3">실시간 트렌드 분석</h4>
              <p className="font-bold text-gray-800 mb-4">
                AI 교육 분야의 최신 동향을 실시간으로 수집하고 분석하여,
                놓치지 말아야 할 중요한 변화를 빠르게 전달합니다.
              </p>
              <div className="bg-cyan-100 border-2 border-black p-4">
                <p className="font-black text-sm">✅ 매일 업데이트되는 뉴스</p>
                <p className="font-black text-sm">✅ 트렌드 요약 리포트</p>
                <p className="font-black text-sm">✅ 영향력 분석 제공</p>
              </div>
            </div>

            {/* 기능 3 */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
              <div className="bg-lime-200 w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black mb-3">맞춤형 큐레이션</h4>
              <p className="font-bold text-gray-800 mb-4">
                관심 분야와 수준에 맞는 뉴스를 추천하여,
                효율적으로 필요한 정보만 선택적으로 학습할 수 있습니다.
              </p>
              <div className="bg-lime-100 border-2 border-black p-4">
                <p className="font-black text-sm">✅ AI 기반 추천 시스템</p>
                <p className="font-black text-sm">✅ 난이도별 분류</p>
                <p className="font-black text-sm">✅ 관심사별 필터링</p>
              </div>
            </div>

            {/* 기능 4 */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
              <div className="bg-yellow-200 w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black mb-3">학습 커뮤니티</h4>
              <p className="font-bold text-gray-800 mb-4">
                교육자와 학습자가 함께 모여 인사이트를 공유하고,
                서로의 경험을 통해 더 깊이 배울 수 있습니다.
              </p>
              <div className="bg-yellow-100 border-2 border-black p-4">
                <p className="font-black text-sm">✅ 댓글과 토론 기능</p>
                <p className="font-black text-sm">✅ 저장 및 공유</p>
                <p className="font-black text-sm">✅ 학습 기록 관리</p>
              </div>
            </div>
          </div>
        </section>

        {/* 가치 제안 */}
        <section className="mb-16">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-4xl font-black text-center mb-8">
              우리가 약속하는 가치 ✨
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-lime-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2">신뢰할 수 있는 정보</h4>
                  <p className="font-bold text-gray-800">
                    검증된 출처에서 엄선한 뉴스만을 제공하며,
                    편향되지 않은 객관적인 시각을 유지합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2">빠른 업데이트</h4>
                  <p className="font-bold text-gray-800">
                    AI 교육 분야의 빠른 변화에 맞춰 매일 새로운 콘텐츠를 업데이트하고,
                    중요한 뉴스는 실시간으로 알려드립니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pink-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2">효과적인 학습</h4>
                  <p className="font-bold text-gray-800">
                    단순히 정보를 제공하는 것을 넘어,
                    파인만 기법을 통해 실제로 이해하고 적용할 수 있도록 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-300 to-lime-300 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-4xl font-black mb-4">
              지금 바로 시작하세요! 🚀
            </h3>
            <p className="text-lg font-bold mb-6">
              AI 교육의 최신 트렌드를 파인만 기법으로 쉽게 배우세요.
              <br />
              무료로 시작하고 나만의 학습 대시보드를 만들어보세요.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg"
              >
                무료로 시작하기
              </Link>
              <Link
                href="/ko/news"
                className="px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg"
              >
                뉴스 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-3xl">🤖</span>
              <p className="font-black text-xl">AI EDU NEWS</p>
            </div>
            <div className="flex gap-6">
              <Link href="/guide" className="font-bold hover:underline">
                이용 가이드
              </Link>
              <Link href="/platform" className="font-bold hover:underline">
                플랫폼 소개
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 font-bold text-gray-600">
            © 2025 AI EDU NEWS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
