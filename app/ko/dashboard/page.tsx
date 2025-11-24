/**
 * 사용자 대시보드 페이지
 * Neo-Brutalism 디자인 적용
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookmarkIcon,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
  BarChart3,
  BookOpen,
  Loader2,
  Eye
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SavedArticle {
  id: string;
  articleId: string;
  feynmanTitle: string;
  feynmanSummary: string;
  category: string;
  difficultyLevel?: number;
  readAt?: Date;
  savedAt?: Date;
}

interface LearningStats {
  totalArticlesRead: number;
  totalTimeSpent: number;
  streakDays: number;
  favoriteCategory: string;
  difficultyProgress: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LearningStats>({
    totalArticlesRead: 0,
    totalTimeSpent: 0,
    streakDays: 0,
    favoriteCategory: '',
    difficultyProgress: {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 1. Fetch saved/bookmarked articles (Top 6)
        const bookmarksRef = collection(db, 'users', user.uid, 'bookmarks');
        const bookmarksQuery = query(bookmarksRef, orderBy('savedAt', 'desc'), limit(6));
        const bookmarksSnapshot = await getDocs(bookmarksQuery);

        const bookmarksData = bookmarksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          savedAt: doc.data().savedAt?.toDate(),
        })) as SavedArticle[];
        setSavedArticles(bookmarksData);

        // 2. Fetch reading history for analysis (Top 300 for stats)
        const historyRef = collection(db, 'users', user.uid, 'history');
        const historyStatsQuery = query(historyRef, orderBy('readAt', 'desc'), limit(300));
        const historySnapshot = await getDocs(historyStatsQuery);

        // 3. Get total count of read articles
        const totalCountSnapshot = await getCountFromServer(historyRef);
        const totalReadCount = totalCountSnapshot.data().count;

        const historyData = historySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          readAt: doc.data().readAt?.toDate(),
        })) as SavedArticle[];

        // Set recent articles for UI (Top 4)
        setRecentArticles(historyData.slice(0, 4));

        // 4. Calculate Statistics

        // A. Favorite Category
        const categoryCounts = historyData.reduce((acc: any, article) => {
          acc[article.category] = (acc[article.category] || 0) + 1;
          return acc;
        }, {});

        const favoriteCategory = Object.keys(categoryCounts).reduce((a, b) =>
          categoryCounts[a] > categoryCounts[b] ? a : b,
          ''
        );

        // B. Difficulty Progress
        const difficultyProgress = historyData.reduce((acc, article) => {
          const level = article.difficultyLevel || 3;
          if (level <= 2) acc.beginner++;
          else if (level === 3) acc.intermediate++;
          else acc.advanced++;
          return acc;
        }, { beginner: 0, intermediate: 0, advanced: 0 });

        // C. Streak Calculation
        let streak = 0;
        if (historyData.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Group read dates (unique days)
          const readDates = new Set(
            historyData
              .filter(item => item.readAt)
              .map(item => {
                const date = new Date(item.readAt!);
                date.setHours(0, 0, 0, 0);
                return date.getTime();
              })
          );

          // Check streak from today backwards
          let checkDate = new Date(today);

          // If didn't read today, check from yesterday
          if (!readDates.has(checkDate.getTime())) {
            checkDate.setDate(checkDate.getDate() - 1);
            // If didn't read yesterday either, streak is 0
            if (!readDates.has(checkDate.getTime())) {
              streak = 0;
            } else {
              streak = 1;
              checkDate.setDate(checkDate.getDate() - 1);
              while (readDates.has(checkDate.getTime())) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
              }
            }
          } else {
            // Read today
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            while (readDates.has(checkDate.getTime())) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            }
          }
        }

        setStats({
          totalArticlesRead: totalReadCount,
          totalTimeSpent: totalReadCount * 5, // Estimate 5 min per article
          streakDays: streak,
          favoriteCategory: favoriteCategory || '아직 없음',
          difficultyProgress,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const difficultyColors = {
    beginner: 'bg-lime-200',
    intermediate: 'bg-cyan-200',
    advanced: 'bg-pink-200',
  };

  const difficultyLabels = {
    beginner: '초급 🟢',
    intermediate: '중급 🟡',
    advanced: '고급 🔴',
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-300 via-lime-300 to-cyan-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="text-xl font-black">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-lime-300 to-cyan-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/ko" className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">AI EDU NEWS</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/ko/news"
              className="px-4 py-2 bg-violet-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
            >
              뉴스 보기
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-block mb-4 px-6 py-3 bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              환영합니다, {user?.displayName || '학습자'}님!
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            나의 학습 대시보드 📊
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Articles Read */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-lime-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">읽은 기사</p>
                <p className="text-3xl font-black">{stats.totalArticlesRead}</p>
              </div>
            </div>
          </div>

          {/* Total Time Spent */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-cyan-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">학습 시간</p>
                <p className="text-3xl font-black">{stats.totalTimeSpent}분</p>
              </div>
            </div>
          </div>

          {/* Streak Days */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-pink-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">연속 학습</p>
                <p className="text-3xl font-black">{stats.streakDays}일</p>
              </div>
            </div>
          </div>

          {/* Favorite Category */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-200 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">관심 분야</p>
                <p className="text-xl font-black">{stats.favoriteCategory}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Progress */}
        <div className="mb-12">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8" />
              <h3 className="text-3xl font-black">난이도별 학습 진행</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(Object.keys(stats.difficultyProgress) as Array<keyof typeof stats.difficultyProgress>).map((level) => (
                <div key={level} className={`${difficultyColors[level]} border-2 border-black p-6 text-center`}>
                  <p className="text-xl font-black mb-2">{difficultyLabels[level]}</p>
                  <p className="text-4xl font-black">{stats.difficultyProgress[level]}</p>
                  <p className="text-sm font-bold text-gray-700 mt-2">기사 읽음</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Saved Articles */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookmarkIcon className="w-8 h-8" />
              <h3 className="text-3xl font-black">저장한 기사</h3>
            </div>

            {savedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-bold mb-4">아직 저장한 기사가 없습니다</p>
                <Link
                  href="/ko/news"
                  className="inline-block px-6 py-3 bg-lime-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
                >
                  뉴스 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/ko/news/${article.articleId}`}
                    className="block p-4 bg-lime-50 border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                  >
                    <h4 className="font-black mb-2">{article.feynmanTitle}</h4>
                    <p className="text-sm font-bold text-gray-700 line-clamp-2 mb-2">
                      {article.feynmanSummary}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 border border-black font-bold ${(article.difficultyLevel || 3) <= 2 ? 'bg-lime-200' :
                        (article.difficultyLevel || 3) === 3 ? 'bg-cyan-200' : 'bg-pink-200'
                        }`}>
                        {(article.difficultyLevel || 3) <= 2 ? '초급 🟢' :
                          (article.difficultyLevel || 3) === 3 ? '중급 🟡' : '고급 🔴'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reading History */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8" />
              <h3 className="text-3xl font-black">최근 읽은 기사</h3>
            </div>

            {recentArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-bold mb-4">아직 읽은 기사가 없습니다</p>
                <Link
                  href="/ko/news"
                  className="inline-block px-6 py-3 bg-cyan-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
                >
                  뉴스 읽기 시작
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/ko/news/${article.articleId}`}
                    className="block p-4 bg-cyan-50 border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black flex-1">{article.feynmanTitle}</h4>
                      {article.readAt && (
                        <span className="text-xs font-bold text-gray-600 ml-2">
                          {article.readAt.toLocaleDateString('ko-KR')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-700 line-clamp-2 mb-2">
                      {article.feynmanSummary}
                    </p>
                    <span className="text-xs px-3 py-1 bg-pink-200 border border-black font-bold inline-block">
                      {article.category}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-gradient-to-r from-pink-300 to-cyan-300 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-3xl font-black">맞춤 추천</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black p-6">
              <p className="text-xl font-black mb-2">🎯 다음 단계로</p>
              {stats.difficultyProgress.beginner > 5 && stats.difficultyProgress.intermediate <= 5 ? (
                <>
                  <p className="font-bold text-gray-700 mb-4">
                    초급 기사를 충분히 읽으셨네요! 이제 중급 난이도에 도전해볼까요?
                  </p>
                  <Link
                    href="/ko/news?difficulty=intermediate"
                    className="inline-block px-4 py-2 bg-cyan-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm"
                  >
                    중급 기사 보기
                  </Link>
                </>
              ) : stats.difficultyProgress.intermediate > 5 ? (
                <>
                  <p className="font-bold text-gray-700 mb-4">
                    중급 기사도 마스터하셨군요! 고급 난이도로 실력을 키워보세요.
                  </p>
                  <Link
                    href="/ko/news?difficulty=advanced"
                    className="inline-block px-4 py-2 bg-pink-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm"
                  >
                    고급 기사 보기
                  </Link>
                </>
              ) : (
                <>
                  <p className="font-bold text-gray-700 mb-4">
                    아직 시작 단계시군요! 초급 기사부터 차근차근 읽어보세요.
                  </p>
                  <Link
                    href="/ko/news?difficulty=beginner"
                    className="inline-block px-4 py-2 bg-lime-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm"
                  >
                    초급 기사 보기
                  </Link>
                </>
              )}
            </div>

            <div className="bg-white border-2 border-black p-6">
              <p className="text-xl font-black mb-2">🔥 인기 급상승</p>
              <p className="font-bold text-gray-700 mb-4">
                이번 주 가장 많이 읽힌 AI 교육 트렌드를 확인하세요
              </p>
              <Link
                href="/ko/news?category=trends"
                className="inline-block px-4 py-2 bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm"
              >
                트렌드 보기
              </Link>
            </div>

            <div className="bg-white border-2 border-black p-6">
              <p className="text-xl font-black mb-2">💡 학습 팁</p>
              <p className="font-bold text-gray-700 mb-4">
                파인만 기법으로 더 효과적으로 학습하는 방법을 알아보세요
              </p>
              <Link
                href="/guide"
                className="inline-block px-4 py-2 bg-lime-200 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-sm"
              >
                가이드 보기
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
