/**
 * 관리자 설정 페이지
 * xAI API 키 설정 및 시스템 환경 변수 관리
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Key, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [xaiApiKey, setXaiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?callbackUrl=/admin/settings');
    } else if (!authLoading && user && !isAdmin) {
      router.push('/ko/news');
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    // 현재 저장된 API 키 불러오기 (마스킹 처리)
    const loadApiKey = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (data.xaiApiKey) {
          // 마지막 4자리만 표시
          const masked = '****' + data.xaiApiKey.slice(-4);
          setXaiApiKey(masked);
        }
        if (data.openaiApiKey) {
          const masked = '****' + data.openaiApiKey.slice(-4);
          setOpenaiApiKey(masked);
        }
      } catch (error) {
        console.error('API 키 불러오기 오류:', error);
      }
    };

    if (user && isAdmin) {
      loadApiKey();
    }
  }, [user, isAdmin]);

  const handleSave = async () => {
    if (!xaiApiKey.trim()) {
      setMessage({ type: 'error', text: 'xAI API 키를 입력해주세요.' });
      return;
    }

    // 마스킹된 키인 경우 저장하지 않음
    if (xaiApiKey.startsWith('****') && (!openaiApiKey || openaiApiKey.startsWith('****'))) {
      setMessage({ type: 'error', text: '새로운 API 키를 입력해주세요.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload: any = {};

      // xAI 키가 새로 입력된 경우에만 포함
      if (!xaiApiKey.startsWith('****')) {
        payload.xaiApiKey = xaiApiKey.trim();
      }

      // OpenAI 키가 새로 입력된 경우에만 포함
      if (openaiApiKey && !openaiApiKey.startsWith('****')) {
        payload.openaiApiKey = openaiApiKey.trim();
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API 키 저장 실패');
      }

      setMessage({ type: 'success', text: 'API 키가 성공적으로 저장되었습니다!' });

      // 마스킹된 형태로 다시 표시
      if (!xaiApiKey.startsWith('****')) {
        const masked = '****' + xaiApiKey.slice(-4);
        setXaiApiKey(masked);
      }
      if (openaiApiKey && !openaiApiKey.startsWith('****')) {
        const masked = '****' + openaiApiKey.slice(-4);
        setOpenaiApiKey(masked);
      }
      setShowApiKey(false);
      setShowOpenaiKey(false);
    } catch (error) {
      console.error('API 키 저장 오류:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'API 키 저장 중 오류가 발생했습니다.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
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
            <span className="text-3xl">🔧</span>
            <h1 className="text-2xl font-black">설정</h1>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-5xl font-black mb-2">⚙️ 시스템 설정</h2>
          <p className="text-xl font-bold text-gray-800">
            xAI Grok API 키 및 환경 변수 관리
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 border-4 border-black ${message.type === 'success' ? 'bg-green-200' : 'bg-red-200'
            } flex items-center gap-3`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        {/* xAI API Key Section */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-8 h-8" />
            <h3 className="text-3xl font-black">xAI Grok API 키</h3>
          </div>

          <div className="space-y-6">
            {/* API Key Input */}
            <div>
              <label className="block font-bold mb-2">API 키</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={xaiApiKey}
                  onChange={(e) => setXaiApiKey(e.target.value)}
                  placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border-4 border-black font-mono text-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-sm font-bold text-gray-600">
                💡 xAI 콘솔에서 발급받은 API 키를 입력하세요
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-4 border-blue-500 p-4">
              <h4 className="font-black mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                API 키 발급 방법
              </h4>
              <ol className="list-decimal list-inside space-y-1 font-bold text-sm">
                <li>
                  <a
                    href="https://console.x.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    xAI Console (console.x.ai)
                  </a>
                  에 접속
                </li>
                <li>로그인 후 "API Keys" 메뉴로 이동</li>
                <li>"Create new secret key" 클릭</li>
                <li>생성된 키를 복사하여 위 입력란에 붙여넣기</li>
              </ol>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-4 bg-green-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  API 키 저장
                </>
              )}
            </button>
          </div>
        </div>

        {/* OpenAI API Key Section */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-8 h-8" />
            <h3 className="text-3xl font-black">OpenAI API 키 (선택사항)</h3>
          </div>

          <div className="space-y-6">
            {/* API Key Input */}
            <div>
              <label className="block font-bold mb-2">API 키</label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border-4 border-black font-mono text-sm focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded"
                >
                  {showOpenaiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-sm font-bold text-gray-600">
                💡 Grok API 실패 시 GPT-4로 자동 전환 (Fallback)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 border-4 border-purple-500 p-4">
              <h4 className="font-black mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                OpenAI API 키 발급 방법
              </h4>
              <ol className="list-decimal list-inside space-y-1 font-bold text-sm">
                <li>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    OpenAI Platform (platform.openai.com)
                  </a>
                  에 접속
                </li>
                <li>로그인 후 "API keys" 메뉴로 이동</li>
                <li>"Create new secret key" 클릭</li>
                <li>생성된 키를 복사하여 위 입력란에 붙여넣기</li>
              </ol>
              <p className="mt-3 text-xs font-bold text-purple-700">
                ⚠️ 선택사항: xAI Grok이 정상 작동하면 OpenAI는 사용되지 않습니다
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-yellow-100 border-4 border-yellow-500 p-6">
          <h4 className="font-black mb-3 text-lg">🔒 보안 안내</h4>
          <ul className="space-y-2 font-bold text-sm">
            <li>• API 키는 서버 환경 변수에 안전하게 저장됩니다</li>
            <li>• 클라이언트에서는 마스킹된 형태로만 표시됩니다</li>
            <li>• API 키는 절대 공개 저장소에 커밋하지 마세요</li>
            <li>• 정기적으로 키를 갱신하는 것을 권장합니다</li>
          </ul>
        </div>

        {/* Test API Connection (Future Feature) */}
        <div className="mt-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 opacity-50">
          <h3 className="text-2xl font-black mb-4">🧪 API 연결 테스트</h3>
          <p className="font-bold text-gray-600 mb-4">
            저장된 API 키로 xAI Grok 연결을 테스트합니다
          </p>
          <button
            disabled
            className="px-6 py-3 bg-gray-300 text-gray-600 border-4 border-black font-black cursor-not-allowed"
          >
            테스트 실행 (개발 중)
          </button>
        </div>
      </div>
    </div>
  );
}
