/**
 * 비밀번호 재설정 페이지
 * Neo-Brutalism 디자인 적용
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 유효성 검사
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);

      // Firebase 에러 메시지 처리
      switch (err.code) {
        case 'auth/user-not-found':
          setError('등록되지 않은 이메일 주소입니다.');
          break;
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 주소입니다.');
          break;
        case 'auth/too-many-requests':
          setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          setError('비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-lime-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로 돌아가기
        </Link>

        {/* 비밀번호 재설정 카드 */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-200 border-2 border-black rounded-full mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black mb-2">비밀번호 재설정</h1>
            <p className="text-gray-600 font-bold">
              가입한 이메일 주소를 입력해주세요
            </p>
          </div>

          {/* 성공 메시지 */}
          {success && (
            <div className="mb-6 p-4 bg-lime-200 border-2 border-black flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-black text-sm mb-1">이메일 전송 완료!</p>
                <p className="text-sm font-bold">
                  비밀번호 재설정 링크가 이메일로 전송되었습니다.
                  <br />
                  이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
                </p>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-200 border-2 border-black">
              <p className="font-bold text-sm">{error}</p>
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block font-black mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-cyan-400 font-bold"
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-cyan-200 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '전송 중...' : '재설정 이메일 보내기'}
            </button>
          </form>

          {/* 추가 안내 */}
          <div className="mt-6 p-4 bg-yellow-100 border-2 border-black">
            <p className="text-sm font-bold text-gray-700">
              💡 <span className="font-black">안내:</span> 이메일이 도착하지 않으면 스팸함을 확인해주세요.
            </p>
          </div>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-gray-600">
              비밀번호가 기억나셨나요?{' '}
              <Link
                href="/auth/login"
                className="text-cyan-600 hover:underline font-black"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
