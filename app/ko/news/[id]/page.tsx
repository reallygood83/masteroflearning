/**
 * \ub274\uc2a4 \uc0c1\uc138 \ud398\uc774\uc9c0
 * \ud30c\uc778\ub9cc \uae30\ubc95 \uae30\ubc18 \uc124\uba85
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
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
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
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
      // 로그인하지 않은 사용자는 공유 페이지로 리다이렉트
      router.replace(`/share/${params.id}`);
    }
  }, [user, authLoading, router, params.id]);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      if (!user) return;

      try {
        const articleRef = doc(db, 'articles', params.id);
        const articleSnap = await getDoc(articleRef);

        if (articleSnap.exists()) {
          const data = articleSnap.data();
          const currentArticle = {
            id: articleSnap.id,
            ...data,
            publishedAt: data.publishedAt?.toDate() || new Date(),
          } as Article;

          setArticle(currentArticle);

          // 관련 기사 가져오기 (같은 카테고리)
          if (currentArticle.category) {
            const articlesRef = collection(db, 'articles');
            const q = query(
              articlesRef,
              where('category', '==', currentArticle.category),
              where('status', '==', 'published'), // 게시된 기사만
              orderBy('publishedAt', 'desc'),
              limit(4) // 현재 기사 포함해서 4개 가져옴
            );

            const querySnapshot = await getDocs(q);
            const related = querySnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
                publishedAt: doc.data().publishedAt?.toDate() || new Date(),
              } as Article))
              .filter(a => a.id !== params.id) // 현재 기사 제외
              .slice(0, 3); // 3개만 유지

            setRelatedArticles(related);
          }

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

    fetchArticleAndRelated();
  }, [user, params.id]);

  // 북마크 상태 확인
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user) return;
      try {
        const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', params.id);
        const bookmarkSnap = await getDoc(bookmarkRef);
        setBookmarked(bookmarkSnap.exists());
      } catch (error) {
        console.error('북마크 확인 오류:', error);
      }
    };
    checkBookmarkStatus();
  }, [user, params.id]);

  // 읽은 목록에 추가
  useEffect(() => {
    const addToHistory = async () => {
      if (!user || !article) return;
      try {
        const historyRef = doc(db, 'users', user.uid, 'history', params.id);
        await setDoc(historyRef, {
          articleId: article.id,
          feynmanTitle: article.feynmanTitle,
          feynmanSummary: article.feynmanSummary,
          category: article.category,
          difficultyLevel: article.difficultyLevel,
          readAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('히스토리 저장 오류:', error);
      }
    };

    if (article) {
      addToHistory();
    }
  }, [user, article, params.id]);

  const handleShare = async () => {
    if (!article) return;

    // 공개 공유 URL 생성 (누구나 로그인 없이 읽을 수 있음)
    const shareUrl = `${window.location.origin}/share/${params.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.feynmanTitle,
          text: article.feynmanSummary,
          url: shareUrl,
        });
      } catch (error) {
        console.error('공유 오류:', error);
      }
    } else {
      // Fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('공유 링크가 복사되었습니다!\n누구나 로그인 없이 읽을 수 있는 링크입니다.');
      } catch (err) {
        console.error('링크 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      }
    }
  };

  const handleBookmark = async () => {
    if (!user || !article) return;

    try {
      const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', params.id);

      if (bookmarked) {
        // 북마크 삭제
        await deleteDoc(bookmarkRef);
        setBookmarked(false);
        alert('보관함에서 삭제되었습니다.');
      } else {
        // 북마크 추가
        await setDoc(bookmarkRef, {
          articleId: article.id,
          feynmanTitle: article.feynmanTitle,
          feynmanSummary: article.feynmanSummary,
          category: article.category,
          difficultyLevel: article.difficultyLevel,
          savedAt: serverTimestamp(),
        });
        setBookmarked(true);
        alert('보관함에 저장되었습니다.');
      }
    } catch (error) {
      console.error('북마크 처리 오류:', error);
      alert('작업을 처리하는 중 오류가 발생했습니다.');
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
        <article className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8">
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

            <h1 className="text-2xl md:text-4xl font-black mb-4">{article.feynmanTitle}</h1>

            {/* Meta */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm font-bold text-gray-600 pb-4 border-b-4 border-black">
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
              onClick={handleBookmark}
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
          {relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/ko/news/${related.id}`}
                  className="block bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-black border border-black ${difficultyColors[related.difficultyLevel] || 'bg-gray-200'}`}>
                      {difficultyLabels[related.difficultyLevel] || '보통'}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {related.publishedAt.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mb-2 line-clamp-2">
                    {related.feynmanTitle}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {related.feynmanSummary}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
              <p className="font-bold text-gray-600">관련 기사가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
