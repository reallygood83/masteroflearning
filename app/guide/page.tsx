/**
 * 이용 가이드 페이지
 * Neo-Brutalism 디자인 적용
 */

'use client';

import Link from 'next/link';
import { BookOpen, User, Sparkles, Search, Heart, Bell, ArrowLeft } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-yellow-300 to-cyan-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/ko" className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">AI EDU NEWS</h1>
          </Link>
          <Link
            href="/ko"
            className="px-4 py-2 bg-pink-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-3 bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              사용자 가이드
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            AI EDU NEWS<br />이용 가이드 📖
          </h2>
          <p className="text-xl font-bold text-gray-800">
            플랫폼을 100% 활용하는 방법
          </p>
        </div>

        {/* 가이드 섹션들 */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. 시작하기 */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-pink-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">1. 시작하기</h3>
                <p className="font-bold text-gray-800 mb-4">
                  회원가입부터 시작해보세요!
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="bg-pink-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">✅ 회원가입</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 이메일과 비밀번호로 간편하게 가입</li>
                  <li>• 또는 Google 계정으로 빠른 가입</li>
                  <li>• 무료로 모든 기능 이용 가능</li>
                </ul>
              </div>

              <div className="bg-pink-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">✅ 프로필 설정</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 관심 분야 선택 (AI 기술, 교육 방법론 등)</li>
                  <li>• 난이도 설정 (초급, 중급, 고급)</li>
                  <li>• 알림 설정 맞춤화</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. 뉴스 탐색하기 */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-cyan-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">2. 뉴스 탐색하기</h3>
                <p className="font-bold text-gray-800 mb-4">
                  다양한 방법으로 뉴스를 찾아보세요
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="bg-cyan-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">🔍 검색 기능</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 키워드로 뉴스 검색</li>
                  <li>• 카테고리별 필터링 (AI 기술, 정책, 도구 등)</li>
                  <li>• 난이도별 정렬</li>
                </ul>
              </div>

              <div className="bg-cyan-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">📚 추천 뉴스</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 내 관심사 기반 맞춤 추천</li>
                  <li>• 인기 뉴스 모아보기</li>
                  <li>• 최신 트렌드 파악</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 파인만 기법으로 읽기 */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-lime-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">3. 파인만 기법으로 읽기</h3>
                <p className="font-bold text-gray-800 mb-4">
                  복잡한 개념을 쉽게 이해하세요
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="bg-lime-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">💡 파인만 기법이란?</h4>
                <p className="font-bold text-sm mb-2">
                  노벨상 수상자 리처드 파인만이 고안한 학습 방법으로, 복잡한 개념을 간단한 언어로 설명하여 이해를 돕습니다.
                </p>
              </div>

              <div className="bg-lime-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">✨ 우리 플랫폼의 적용</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 🎯 핵심 개념을 쉬운 말로 설명</li>
                  <li>• 🔄 비유와 예시로 이해도 향상</li>
                  <li>• 📝 단계별로 나누어 학습</li>
                  <li>• 💬 일상 언어로 풀어쓴 설명</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. 저장 및 관리 */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-yellow-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">4. 저장 및 관리</h3>
                <p className="font-bold text-gray-800 mb-4">
                  나만의 학습 라이브러리를 만드세요
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="bg-yellow-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">❤️ 저장하기</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 관심 있는 뉴스를 '좋아요'로 저장</li>
                  <li>• 나중에 읽을 뉴스를 북마크</li>
                  <li>• 대시보드에서 한눈에 관리</li>
                </ul>
              </div>

              <div className="bg-yellow-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">📊 학습 기록</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 읽은 뉴스 자동 기록</li>
                  <li>• 관심 분야별 통계 확인</li>
                  <li>• 학습 패턴 분석</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. 알림 설정 */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-violet-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">5. 알림 설정</h3>
                <p className="font-bold text-gray-800 mb-4">
                  놓치지 말아야 할 뉴스를 알려드립니다
                </p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="bg-violet-100 border-2 border-black p-4">
                <h4 className="font-black mb-2">🔔 맞춤 알림</h4>
                <ul className="space-y-2 font-bold text-sm">
                  <li>• 관심 분야의 새 뉴스 알림</li>
                  <li>• 주간/월간 요약 리포트</li>
                  <li>• 중요 트렌드 변화 알림</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-300 to-cyan-300 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black mb-4">
              지금 바로 시작하세요! 🚀
            </h3>
            <p className="text-lg font-bold mb-6">
              AI 교육의 최신 트렌드를 파인만 기법으로 쉽게 배우세요
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
