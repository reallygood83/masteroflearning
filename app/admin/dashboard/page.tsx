/**
 * 관리자 대시보드
 * 기사 관리, 통계, 사용자 관리
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Plus, Edit, Trash2, Users, FileText, TrendingUp, Eye, Loader2, Settings, RefreshCw, Archive } from 'lucide-react';

interface Article {
  id: string;
  feynmanTitle: string;
  category: string;
  publishedAt: Date;
  views: number;
  status: 'draft' | 'published';
  archived?: boolean;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?callbackUrl=/admin/dashboard');
    } else if (!authLoading && user && !isAdmin) {
      router.push('/ko/news');
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || !isAdmin) return;

      try {
        // 기사 목록 가져오기
        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, orderBy('publishedAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);

        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data().publishedAt?.toDate() || new Date(),
        })) as Article[];

        setArticles(articlesData);

        // 통계 (임시)
        setStats({
          totalArticles: querySnapshot.size,
          totalUsers: 156, // TODO: Firestore에서 가져오기
          totalViews: 8542, // TODO: Firestore에서 가져오기
        });
      } catch (error) {
        console.error('관리자 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, isAdmin]);

  const handleDelete = async (articleId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'articles', articleId));
      setArticles(articles.filter(a => a.id !== articleId));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleArchive = async (articleId: string, currentArchived: boolean) => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !currentArchived }),
      });

      if (!response.ok) throw new Error('보관 처리 실패');

      // UI 업데이트
      setArticles(articles.map(a =>
        a.id === articleId ? { ...a, archived: !currentArchived } : a
      ));

      alert(currentArchived ? '보관 해제되었습니다.' : '영구 보관되었습니다.');
    } catch (error) {
      console.error('보관 처리 실패:', error);
      alert('보관 처리 중 오류가 발생했습니다.');
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
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🔑</span>
            <h1 className="text-2xl font-black">ADMIN</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 font-bold bg-red-300 border-2 border-black"
            >
              대시보드
            </Link>
            <Link
              href="/ko/news"
              className="px-4 py-2 font-bold hover:underline"
            >
              뉴스 보기
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-5xl font-black mb-2">🔑 관리자 대시보드</h2>
            <p className="text-xl font-bold text-gray-800">
              기사 관리 | 사용자 관리 | 통계분석
            </p>
          </div>
          <Link
            href="/admin/articles/create"
            className="px-6 py-3 bg-green-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            새 기사 작성
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8" />
              <h3 className="text-2xl font-black">총 기사</h3>
            </div>
            <p className="text-4xl font-black">{stats.totalArticles}</p>
          </div>

          <div className="bg-pink-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8" />
              <h3 className="text-2xl font-black">총 사용자</h3>
            </div>
            <p className="text-4xl font-black">{stats.totalUsers}</p>
          </div>

          <div className="bg-green-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-8 h-8" />
              <h3 className="text-2xl font-black">총 조회수</h3>
            </div>
            <p className="text-4xl font-black">{stats.totalViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            최근 기사
          </h3>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 font-bold mb-4">등록된 기사가 없습니다</p>
              <Link
                href="/admin/articles/create"
                className="inline-block px-6 py-3 bg-green-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black"
              >
                첫 기사 작성하기
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th className="text-left p-3 font-black">제목</th>
                    <th className="text-left p-3 font-black">카테고리</th>
                    <th className="text-left p-3 font-black">작성일</th>
                    <th className="text-left p-3 font-black">조회수</th>
                    <th className="text-left p-3 font-black">상태</th>
                    <th className="text-right p-3 font-black">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b-2 border-gray-200">
                      <td className="p-3 font-bold">
                        <Link
                          href={`/ko/news/${article.id}`}
                          className="hover:text-blue-600"
                        >
                          {article.feynmanTitle}
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 border border-black text-xs font-bold">
                          {article.category}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {article.publishedAt.toLocaleDateString('ko-KR')}
                      </td>
                      <td className="p-3 text-sm font-bold">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 border border-black text-xs font-bold ${article.status === 'published' ? 'bg-green-200' : 'bg-yellow-200'
                          }`}>
                          {article.status === 'published' ? '게시' : '임시저장'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="p-2 bg-blue-400 text-white border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleArchive(article.id, article.archived || false)}
                            className={`p-2 text-white border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 ${
                              article.archived ? 'bg-gray-400' : 'bg-orange-400'
                            }`}
                            title={article.archived ? '보관 해제' : '영구 보관'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 bg-red-400 text-white border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Link
            href="/admin/crawl"
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-6 flex items-center gap-4"
          >
            <RefreshCw className="w-12 h-12" />
            <div>
              <h4 className="text-xl font-black mb-1">뉴스 수집</h4>
              <p className="text-gray-600 font-bold">AI 뉴스 크롤링 및 Feynman 변환</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-6 flex items-center gap-4"
          >
            <Settings className="w-12 h-12" />
            <div>
              <h4 className="text-xl font-black mb-1">설정</h4>
              <p className="text-gray-600 font-bold">사이트 설정 및 권한 관리</p>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 p-6 flex items-center gap-4"
          >
            <TrendingUp className="w-12 h-12" />
            <div>
              <h4 className="text-xl font-black mb-1">분석</h4>
              <p className="text-gray-600 font-bold">사용자 통계 및 트래픽 분석</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
