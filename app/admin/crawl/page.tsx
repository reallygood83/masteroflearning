/**
 * 관리자 뉴스 크롤링 및 처리 페이지
 * 뉴스 수집, Grok 처리, 상태 모니터링
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ArrowLeft, Play, Zap, RefreshCw, Loader2, CheckCircle, AlertCircle, CheckSquare, Square } from 'lucide-react';

interface RawNews {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  status: 'pending' | 'selected' | 'processed' | 'published';
  category: string;
  country: string;
  url: string;
}

interface CrawlResult {
  success: boolean;
  totalNews: number;
  newNews: number;
  duplicates: number;
  errors?: string[];
}

interface ProcessResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

export default function AdminCrawlPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [rawNews, setRawNews] = useState<RawNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?callbackUrl=/admin/crawl');
    } else if (!authLoading && user && !isAdmin) {
      router.push('/ko/news');
    }
  }, [user, authLoading, isAdmin, router]);

  const fetchRawNews = async (page: number = 1) => {
    if (!user || !isAdmin) return;

    try {
      setLoading(true);
      const rawNewsRef = collection(db, 'raw_news');

      // 전체 개수 조회 (페이지네이션용)
      const countQuery = query(
        rawNewsRef,
        where('status', '==', 'pending')
      );
      const countSnapshot = await getDocs(countQuery);
      const total = countSnapshot.size;
      setTotalCount(total);
      setTotalPages(Math.ceil(total / itemsPerPage));

      // 페이지별 데이터 조회
      // Firestore는 offset을 지원하지 않으므로, 모든 데이터를 가져온 후 클라이언트에서 페이징
      const allDocs = countSnapshot.docs;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageDocs = allDocs.slice(startIndex, endIndex);

      const newsData = pageDocs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RawNews[];

      console.log('📊 Firestore 쿼리 결과:', {
        totalDocs: total,
        currentPage: page,
        pageSize: newsData.length,
        totalPages: Math.ceil(total / itemsPerPage)
      });

      setRawNews(newsData);
      setCurrentPage(page);
      setSelectedNews(new Set()); // 페이지 변경 시 선택 초기화
    } catch (error) {
      console.error('원본 뉴스 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawNews(1);
  }, [user, isAdmin]);

  const handleCrawl = async () => {
    setCrawling(true);
    setCrawlResult(null);

    try {
      const response = await fetch('/api/admin/crawl', {
        method: 'POST',
      });

      const data = await response.json();
      setCrawlResult(data.data || data);

      // 크롤링 후 목록 새로고침
      await fetchRawNews();
    } catch (error) {
      console.error('크롤링 오류:', error);
      setCrawlResult({
        success: false,
        totalNews: 0,
        newNews: 0,
        duplicates: 0,
        errors: [error instanceof Error ? error.message : '크롤링 중 오류 발생'],
      });
    } finally {
      setCrawling(false);
    }
  };

  const handleProcess = async () => {
    if (selectedNews.size === 0) return;

    setProcessing(true);
    setProcessResult(null);

    try {
      const response = await fetch('/api/admin/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsIds: Array.from(selectedNews), // 선택된 뉴스 ID 전송
        }),
      });

      const data = await response.json();
      setProcessResult(data.data || data);

      // 처리 후 목록 새로고침
      await fetchRawNews();
    } catch (error) {
      console.error('처리 오류:', error);
      setProcessResult({
        success: false,
        processed: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : '처리 중 오류 발생'],
      });
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedNews);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNews(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedNews.size === rawNews.length) {
      setSelectedNews(new Set());
    } else {
      setSelectedNews(new Set(rawNews.map(n => n.id)));
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-black">뉴스 크롤링 & 처리</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 font-bold hover:underline flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드로
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l-4 border-black">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || '관리자'}
                className="w-10 h-10 rounded-full border-2 border-black"
              />
              <span className="font-bold">{user.displayName}</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-5xl font-black mb-2">🔄 뉴스 수집 및 처리</h2>
          <p className="text-xl font-bold text-gray-800">
            AI 교육 뉴스를 크롤링하고 Feynman 스타일로 변환하세요
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Crawl Button */}
          <button
            onClick={handleCrawl}
            disabled={crawling}
            className="bg-blue-400 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-8 flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {crawling ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : (
              <Play className="w-12 h-12" />
            )}
            <div>
              <h3 className="text-2xl font-black mb-2">1. 뉴스 크롤링</h3>
              <p className="font-bold">한국 & 미국 AI 교육 뉴스 수집</p>
            </div>
          </button>

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={processing || selectedNews.size === 0}
            className="bg-green-400 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-8 flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : (
              <Zap className="w-12 h-12" />
            )}
            <div>
              <h3 className="text-2xl font-black mb-2">2. Grok 처리</h3>
              <p className="font-bold">선택한 뉴스 Feynman 스타일로 변환</p>
              <p className="text-sm mt-2 font-black bg-black/20 px-3 py-1 rounded-full inline-block">
                {selectedNews.size}개 선택됨
              </p>
            </div>
          </button>
        </div>

        {/* Crawl Result */}
        {crawlResult && (
          <div
            className={`mb-6 p-6 border-4 border-black ${crawlResult.success ? 'bg-green-200' : 'bg-yellow-200'
              }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {crawlResult.success ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
              <h3 className="text-2xl font-black">크롤링 결과</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white border-2 border-black p-4">
                <p className="font-bold text-gray-600 mb-1">총 수집</p>
                <p className="text-3xl font-black">{crawlResult.totalNews}</p>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <p className="font-bold text-gray-600 mb-1">신규 뉴스</p>
                <p className="text-3xl font-black text-green-600">{crawlResult.newNews}</p>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <p className="font-bold text-gray-600 mb-1">중복 제거</p>
                <p className="text-3xl font-black text-gray-500">{crawlResult.duplicates}</p>
              </div>
            </div>
            {crawlResult.errors && crawlResult.errors.length > 0 && (
              <div className="bg-red-100 border-2 border-red-500 p-4">
                <p className="font-black mb-2">⚠️ 오류:</p>
                <ul className="list-disc list-inside space-y-1">
                  {crawlResult.errors.map((error, idx) => (
                    <li key={idx} className="font-bold text-sm text-red-800">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Process Result */}
        {processResult && (
          <div
            className={`mb-6 p-6 border-4 border-black ${processResult.success ? 'bg-green-200' : 'bg-yellow-200'
              }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {processResult.success ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
              <h3 className="text-2xl font-black">처리 결과</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border-2 border-black p-4">
                <p className="font-bold text-gray-600 mb-1">성공</p>
                <p className="text-3xl font-black text-green-600">{processResult.processed}</p>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <p className="font-bold text-gray-600 mb-1">실패</p>
                <p className="text-3xl font-black text-red-600">{processResult.failed}</p>
              </div>
            </div>
            {processResult.errors && processResult.errors.length > 0 && (
              <div className="bg-red-100 border-2 border-red-500 p-4">
                <p className="font-black mb-2">⚠️ 오류:</p>
                <ul className="list-disc list-inside space-y-1">
                  {processResult.errors.map((error, idx) => (
                    <li key={idx} className="font-bold text-sm text-red-800">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Raw News List */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 cursor-pointer hover:rotate-180 transition-transform" onClick={() => fetchRawNews(currentPage)} />
              <h3 className="text-2xl font-black">
                미처리 뉴스 목록 ({totalCount}개)
              </h3>
            </div>
            {rawNews.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 font-bold hover:underline"
              >
                {selectedNews.size === rawNews.length ? (
                  <>
                    <CheckSquare className="w-5 h-5" />
                    전체 해제
                  </>
                ) : (
                  <>
                    <Square className="w-5 h-5" />
                    전체 선택
                  </>
                )}
              </button>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b-2 border-black">
              <button
                onClick={() => fetchRawNews(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 font-bold border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← 이전
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchRawNews(pageNum)}
                      className={`w-10 h-10 font-bold border-2 border-black ${currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-gray-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => fetchRawNews(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-bold border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음 →
              </button>
              <span className="ml-4 font-bold text-gray-600">
                {currentPage} / {totalPages} 페이지
              </span>
            </div>
          )}

          {rawNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 font-bold mb-4">
                처리 대기 중인 뉴스가 없습니다
              </p>
              <p className="text-sm font-bold text-gray-500">
                💡 위의 "뉴스 크롤링" 버튼을 눌러서 새 뉴스를 수집하세요
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rawNews.map((news) => (
                <div
                  key={news.id}
                  className={`border-2 p-4 transition-colors cursor-pointer ${selectedNews.has(news.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-black hover:bg-gray-50'
                    }`}
                  onClick={() => toggleSelect(news.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      {selectedNews.has(news.id) ? (
                        <CheckSquare className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black mb-2 text-lg">{news.title}</h4>
                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 border border-black font-bold text-xs">
                          {news.category}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 border border-black font-bold text-xs">
                          {news.country}
                        </span>
                        <span className="font-bold text-gray-600 text-xs">{news.source}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(news.publishedAt).toLocaleDateString()}
                        </span>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs ml-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          원본 보기
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-100 border-4 border-blue-500 p-6">
          <h4 className="font-black mb-3 text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            사용 방법
          </h4>
          <ol className="list-decimal list-inside space-y-2 font-bold text-sm">
            <li>
              <strong>1단계:</strong> "뉴스 크롤링" 버튼을 눌러서 한국과 미국의 AI 교육 뉴스를 수집합니다
            </li>
            <li>
              <strong>2단계:</strong> 목록에서 Feynman 스타일로 변환할 뉴스를 <strong>선택(체크)</strong>합니다
            </li>
            <li>
              <strong>3단계:</strong> "Grok 처리" 버튼을 눌러서 선택한 뉴스만 변환합니다
            </li>
            <li>
              <strong>4단계:</strong> 변환된 기사는 자동으로 사용자 뉴스 페이지에 게시됩니다
            </li>
          </ol>
          <p className="mt-4 text-sm font-bold text-blue-800">
            💡 <strong>팁:</strong> 제목을 클릭하여 뉴스를 선택/해제할 수 있습니다. 원본 링크를 클릭하면 새 창에서 기사를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
