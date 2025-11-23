/**
 * \ub274\uc2a4 \uc0c1\uc138 \ud398\uc774\uc9c0
 * \ud30c\uc778\ub9cc \uae30\ubc95 \uae30\ubc18 \uc124\uba85
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Clock, Share2, Bookmark, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
  id: string;
  feynmanTitle: string;
  feynmanContent: string;
  feynmanSummary: string;
  category: string;
  source: string;
  originalUrl: string;
  publishedAt: Date;
  views: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  questions?: Array<{
    question: string;
    reasoning: string;
    type: 'principle' | 'application' | 'opposite';
  }>;
  tags?: string[];
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

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
      router.push(`/auth/login?callbackUrl=/ko/news/${params.id}`);
    }
  }, [user, authLoading, router, params.id]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!user) return;

      try {
        const articleRef = doc(db, 'articles', params.id);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          const data = articleSnap.data();
          setArticle({
            id: articleSnap.id,
            ...data,
            publishedAt: data.publishedAt?.toDate() || new Date(),
          } as Article);

          // 조회수 증가
          await updateDoc(articleRef, {
            views: increment(1),
          });
        }
      } catch (error) {
        console.error('기사 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [user, params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.feynmanTitle,
          text: article?.feynmanSummary,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 오류:', error);
      }
    } else {
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

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

  if (!user || !article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">AI EDU NEWS</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/ko/news"
              className="px-4 py-2 font-bold hover:underline"
            >
              뉴스
            </Link>
            <Link
              href="/ko/dashboard"
              className="px-4 py-2 font-bold hover:underline"
            >
              대시보드
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l-4 border-black">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || '사용자'}
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <span className="font-bold">{user.displayName}</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 뒤로 가기 */}
        <Link
          href="/ko/news"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </Link>

        {/* Main Article */}
        <article className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 font-black border-2 border-black text-sm ${difficultyColors[article.difficultyLevel as keyof typeof difficultyColors]}`}>
                {difficultyLabels[article.difficultyLevel as keyof typeof difficultyLabels]}
              </span>
              <span className="px-4 py-2 bg-blue-100 border-2 border-black font-bold text-sm">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl font-black mb-4">{article.feynmanTitle}</h1>

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm font-bold text-gray-600 pb-4 border-b-4 border-black">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.publishedAt.toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border-4 border-black p-6 mb-8">
            <h2 className="text-2xl font-black mb-3">📝 요약</h2>
            <p className="text-lg font-bold leading-relaxed">{article.feynmanSummary}</p>
          </div>

          {/* Original Article Link */}
          <div className="bg-yellow-50 border-4 border-yellow-500 p-6 mb-8">
            <h2 className="text-xl font-black mb-3">📰 원문 기사</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700 mb-2">출처: {article.source}</p>
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-bold text-sm break-all"
                >
                  {article.originalUrl}
                </a>
              </div>
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 bg-blue-500 text-white border-2 border-black font-bold hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 whitespace-nowrap"
              >
                원문 보기 →
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-black mb-4 mt-8" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-black mb-3 mt-6 border-b-2 border-black pb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-black mb-2 mt-4" {...props} />,
                p: ({ node, ...props }) => <p className="text-lg leading-relaxed mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="text-lg leading-relaxed" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 italic" {...props} />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-300" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded my-4 overflow-x-auto font-mono text-sm" {...props} />
                  ),
                strong: ({ node, ...props }) => <strong className="font-black text-blue-600" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {article.feynmanContent}
            </ReactMarkdown>
          </div>

          {/* Questions */}
          {article.questions && article.questions.length > 0 && (
            <div className="border-t-4 border-black pt-8 space-y-6">
              <h2 className="text-3xl font-black mb-6">🧠 파인만 질문</h2>
              <div className="space-y-4">
                {article.questions.map((q, index) => (
                  <div key={index} className="bg-purple-50 border-4 border-black p-6">
                    <h3 className="text-xl font-black mb-3">❓ {q.question}</h3>
                    <p className="text-lg leading-relaxed mb-2">{q.reasoning}</p>
                    <span className="inline-block px-3 py-1 bg-blue-200 border-2 border-black text-sm font-bold">
                      {q.type === 'principle' ? '원리' : q.type === 'application' ? '응용' : '반대'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t-4 border-black pt-6 mt-6">
              <h3 className="text-lg font-black mb-3">🏷️ 태그</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 border-2 border-black text-sm font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-8 border-t-4 border-black">
            <button
              onClick={handleShare}
              className="flex-1 px-6 py-3 bg-blue-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              공유하기
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex-1 px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black flex items-center justify-center gap-2 ${bookmarked ? 'bg-yellow-300' : 'bg-white'
                }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? '보관함' : '보관하기'}
            </button>
          </div>
        </article>

        {/* Related Articles Section (placeholder for future) */}
        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">🔍 관련 기사</h2>
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <p className="font-bold text-gray-600">관련 기사를 불러오는 중...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
