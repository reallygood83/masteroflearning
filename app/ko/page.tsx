/**
 * 한국어 메인 랜딩 페이지
 * Neo-Brutalism 디자인 시스템 적용
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Sparkles, BookOpen, Users, Zap, ArrowRight, LogIn, UserPlus } from 'lucide-react';

import { useState, useEffect } from 'react';
import { collection, getCountFromServer, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function KoreanHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    weeklyUpdates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. 전체 기사 수 (status: published)
        const articlesColl = collection(db, 'articles');
        const publishedQuery = query(articlesColl, where('status', '==', 'published'));
        const articlesSnapshot = await getCountFromServer(publishedQuery);

        // 2. 전체 사용자 수
        const usersColl = collection(db, 'users');
        const usersSnapshot = await getCountFromServer(usersColl);

        // 3. 주간 업데이트 (최근 7일)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyQuery = query(
          articlesColl,
          where('publishedAt', '>=', Timestamp.fromDate(sevenDaysAgo))
        );
        const weeklySnapshot = await getCountFromServer(weeklyQuery);

        setStats({
          totalArticles: articlesSnapshot.data().count,
          totalUsers: usersSnapshot.data().count,
          weeklyUpdates: weeklySnapshot.data().count,
        });
      } catch (error) {
        console.error('통계 불러오기 실패:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-3 bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI 교육 트렌드를 한눈에
            </p>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            AI 교육 혁신의<br />
            모든 것을 담다 🚀
          </h2>

          <p className="text-xl md:text-2xl font-bold mb-8 text-gray-800">
            파인만 기법으로 쉽게 설명하는<br />
            최신 AI 교육 뉴스 플랫폼
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/ko/news"
              className="px-8 py-4 bg-pink-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2"
            >
              <Brain className="w-6 h-6" />
              뉴스 탐색하기
              <ArrowRight className="w-5 h-5" />
            </Link>

            {!user && (
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2"
              >
                시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black mb-4">
            왜 AI EDU NEWS인가? 💡
          </h3>
          <p className="text-xl font-bold text-gray-800">
            복잡한 AI 교육 트렌드를 누구나 이해할 수 있게
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-cyan-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="bg-white w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <Brain className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black mb-3">파인만 기법 설명</h4>
            <p className="font-bold text-gray-800">
              복잡한 개념을 비유와 예시로 쉽게 풀어드립니다. 누구나 이해할 수 있는 AI 교육 뉴스!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-lime-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="bg-white w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black mb-3">실시간 트렌드</h4>
            <p className="font-bold text-gray-800">
              최신 AI 교육 동향을 실시간으로 업데이트. 교육 현장의 변화를 놓치지 마세요!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-pink-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            <div className="bg-white w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black mb-3">맞춤형 큐레이션</h4>
            <p className="font-bold text-gray-800">
              관심사에 맞는 뉴스만 모아보기. 초급부터 고급까지 난이도별 분류로 효율적 학습!
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black mb-2">{stats.totalArticles.toLocaleString()}+</div>
              <div className="font-bold text-gray-800">큐레이션된 뉴스</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">{stats.totalUsers.toLocaleString()}+</div>
              <div className="font-bold text-gray-800">활성 사용자</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">{stats.weeklyUpdates.toLocaleString()}+</div>
              <div className="font-bold text-gray-800">주간 업데이트</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black mb-4">
            다양한 주제를 탐색하세요 🎯
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[
            { name: 'AI 기술', color: 'bg-violet-200', icon: '🤖' },
            { name: '교육 방법론', color: 'bg-cyan-200', icon: '📚' },
            { name: '정책 & 제도', color: 'bg-yellow-200', icon: '🏛️' },
            { name: '교사 도구', color: 'bg-lime-200', icon: '🛠️' },
            { name: '학습 플랫폼', color: 'bg-pink-200', icon: '💻' },
            { name: '연구 & 논문', color: 'bg-orange-200', icon: '🔬' },
          ].map((category) => (
            <Link
              key={category.name}
              href="/ko/news"
              className={`px-6 py-3 ${category.color} border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold flex items-center gap-2`}
            >
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-pink-300 to-cyan-300 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-6">
            지금 바로 시작하세요! 🚀
          </h3>
          <p className="text-xl font-bold mb-8 text-gray-800">
            AI 교육의 최신 트렌드를 놓치지 마세요.<br />
            무료로 시작하고 나만의 학습 대시보드를 만들어보세요.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {loading ? (
              <div className="px-8 py-4 font-black text-lg text-gray-400">
                로딩 중...
              </div>
            ) : user ? (
              <Link
                href="/ko/dashboard"
                className="px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2"
              >
                내 대시보드로
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2"
                >
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/ko/news"
                  className="px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2"
                >
                  뉴스 둘러보기
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

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
