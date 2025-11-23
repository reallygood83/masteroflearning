/**
 * 권한 없음 페이지
 * Neo-Brutalism Design System
 */

'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-300 via-orange-300 to-yellow-300 p-4">
      <div className="w-full max-w-md">
        {/* 오류 카드 */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          {/* 아이콘 */}
          <div className="text-7xl mb-4">🚫</div>

          {/* 제목 */}
          <h1 className="text-4xl font-black mb-4">접근 권한 없음</h1>

          {/* 설명 */}
          <div className="bg-red-100 border-4 border-black p-4 mb-6">
            <p className="font-bold">
              관리자 페이지에 접근할 수 있는 <br />
              권한이 없습니다.
            </p>
          </div>

          {/* 안내 */}
          <p className="text-lg font-bold mb-6">
            이 페이지는 관리자만 접근할 수 있습니다. <br />
            문의사항이 있으시면 관리자에게 문의해주세요.
          </p>

          {/* 버튼 그룹 */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 px-6 py-4 font-bold text-lg"
            >
              🏠 홈으로 돌아가기
            </button>

            <button
              onClick={() => router.back()}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 px-6 py-4 font-bold text-lg"
            >
              ← 이전 페이지로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
