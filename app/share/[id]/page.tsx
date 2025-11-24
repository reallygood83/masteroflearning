/**
 * 공유용 기사 상세 페이지 (로그인 불필요)
 * 누구나 링크만 있으면 기사 읽기 가능
 * SNS 공유 최적화
 */

import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Share2, ExternalLink } from 'lucide-react';
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
  publishedAt: any;
  views: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  questions?: Array<{
    question: string;
    reasoning: string;
    type: 'principle' | 'application' | 'opposite';
  }>;
  tags?: string[];
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    console.log('🔍 [Share Page] Fetching article:', id);

    const articleRef = adminDb.collection('articles').doc(id);
    const articleSnap = await articleRef.get();

    if (articleSnap.exists) {
      const data = articleSnap.data();

      if (!data) {
        console.error('❌ [Share Page] Article data is null');
        return null;
      }

      console.log('✅ [Share Page] Article found:', data.feynmanTitle);

      // 조회수 증가 (비동기로 처리하여 실패해도 페이지는 렌더링)
      articleRef.update({
        views: (data.views || 0) + 1,
      }).catch(err => console.error('⚠️ [Share Page] Failed to update views:', err));

      return {
        id: articleSnap.id,
        feynmanTitle: data.feynmanTitle || '제목 없음',
        feynmanContent: data.feynmanContent || '',
        feynmanSummary: data.feynmanSummary || '',
        category: data.category || '기타',
        source: data.source || '출처 미상',
        originalUrl: data.originalUrl || '',
        publishedAt: data.publishedAt?.toDate() || new Date(),
        views: data.views || 0,
        difficultyLevel: data.difficultyLevel || 3,
        questions: data.questions,
        tags: data.tags,
      } as Article;
    }

    console.error('❌ [Share Page] Article not found:', id);
    return null;
  } catch (error) {
    console.error('❌ [Share Page] Error fetching article:', error);
    console.error('[Share Page] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id);

  if (!article) {
    return {
      title: '기사를 찾을 수 없습니다 | AI EDU NEWS',
      description: '요청하신 기사가 존재하지 않거나 삭제되었습니다.',
    };
  }

  const baseUrl = 'https://news.teaboard.link';

  return {
    title: `${article.feynmanTitle} | AI EDU NEWS`,
    description: article.feynmanSummary,
    openGraph: {
      title: article.feynmanTitle,
      description: article.feynmanSummary,
      url: `${baseUrl}/share/${params.id}`,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.source],
      tags: article.tags || [],
      images: [
        {
          url: `${baseUrl}/api/og?id=${params.id}`,
          width: 1200,
          height: 630,
          alt: article.feynmanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.feynmanTitle,
      description: article.feynmanSummary,
      images: [`${baseUrl}/api/og?id=${params.id}`],
    },
  };
}

export default async function ShareArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
          <h1 className="text-3xl font-black mb-4">기사를 찾을 수 없습니다</h1>
          <p className="font-bold text-gray-600 mb-6">요청하신 기사가 존재하지 않거나 삭제되었습니다.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 뒤로 가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          홈으로
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
          {article.originalUrl && (
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
                  className="ml-4 px-4 py-2 bg-blue-500 text-white border-2 border-black font-bold hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 whitespace-nowrap flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  원문 보기
                </a>
              </div>
            </div>
          )}

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
        </article>

        {/* CTA - 로그인 유도 */}
        <div className="mt-8 bg-gradient-to-r from-pink-300 to-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <h3 className="text-2xl font-black mb-4">더 많은 AI 교육 뉴스를 보고 싶으신가요?</h3>
          <p className="font-bold text-gray-800 mb-6">
            로그인하시면 맞춤형 뉴스 추천, 북마크, 학습 대시보드 등<br />
            다양한 기능을 무료로 이용하실 수 있습니다!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black"
            >
              무료 회원가입
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
