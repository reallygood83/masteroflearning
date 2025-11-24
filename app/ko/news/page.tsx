/**
 * 뉴스 목록 페이지
 * Firebase Firestore 연동
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

interface NewsArticle {
  id: string;
  feynmanTitle: string;
  feynmanSummary: string;
  category: string;
  source: string;
  publishedAt: Date;
  views: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}

export default function NewsListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '전체', emoji: '📰' },
    { id: 'AI', name: 'AI 기초', emoji: '🤖' },
    { id: 'Education', name: '교육 활용', emoji: '📚' },
    { id: 'AI+Education', name: 'AI 도구', emoji: '🛠️' },
  ];

  const difficultyColors = {
    1: 'bg-green-300',
    2: 'bg-green-400',
    3: 'bg-yellow-300',
    4: 'bg-orange-300',
    5: 'bg-red-300',
  };

  const difficultyLabels = {
    1: '매우 쉬움',
    2: '쉬움',
    3: '보통',
    4: '어려움',
    5: '매우 어려움',
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?callbackUrl=/ko/news');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 30일 이전 날짜 계산
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const articlesRef = collection(db, 'articles');
        const q = query(
          articlesRef,
          where('publishedAt', '>', thirtyDaysAgo),
          orderBy('publishedAt', 'desc'),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data().publishedAt?.toDate() || new Date(),
        })) as NewsArticle[];

        console.log('📰 불러온 기사:', articlesData);
        setArticles(articlesData);
      } catch (error) {
        console.error('뉴스 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user]);

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="font-black text-xl">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">


      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-black mb-4">📰 AI 교육 뉴스</h2>
          <p className="text-lg md:text-xl font-bold text-gray-800">
            최신 AI 교육 소식을 파인만 기법으로 쉽게 이해하세요
          </p>
          <p className="text-sm font-bold text-gray-600 mt-2">
            📅 최근 30일 이내 뉴스만 표시됩니다
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 md:px-6 md:py-3 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm md:text-base ${selectedCategory === category.id
                ? 'bg-blue-400 text-white'
                : 'bg-white'
                }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
            <p className="text-2xl font-black mb-4">📭 아직 뉴스가 없습니다</p>
            <p className="font-bold text-gray-700">
              곧 AI 교육 관련 최신 뉴스를 업데이트할 예정입니다!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Link
                key={article.id}
                href={`/ko/news/${article.id}`}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-6 flex flex-col"
              >
                {/* Difficulty Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 font-black border-2 border-black text-sm ${difficultyColors[article.difficultyLevel as keyof typeof difficultyColors]}`}>
                    {difficultyLabels[article.difficultyLevel as keyof typeof difficultyLabels]}
                  </span>
                  <span className="text-sm font-bold text-gray-600">
                    👁️ {article.views}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black mb-3 line-clamp-2">
                  {article.feynmanTitle}
                </h3>

                {/* Summary */}
                <p className="font-bold text-gray-700 mb-4 line-clamp-3 flex-grow">
                  {article.feynmanSummary}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm font-bold text-gray-600 pt-4 border-t-2 border-black">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.publishedAt.toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {article.source}
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    읽기 <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}
