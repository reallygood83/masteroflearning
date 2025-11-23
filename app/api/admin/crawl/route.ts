/**
 * 뉴스 크롤링 API 엔드포인트
 * POST: 뉴스 크롤링 실행
 */

import { NextRequest, NextResponse } from 'next/server';
import { crawlAllNews } from '@/lib/crawlers';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 관리자 크롤링 요청 시작...');

    // TODO: NextAuth 세션 검증 추가
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    // }

    // 크롤링 실행
    const result = await crawlAllNews();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '크롤링이 완료되었습니다',
        data: {
          totalNews: result.totalNews,
          newNews: result.newNews,
          duplicates: result.totalNews - result.newNews,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '크롤링 중 일부 오류가 발생했습니다',
        data: {
          totalNews: result.totalNews,
          newNews: result.newNews,
          errors: result.errors,
        },
      }, { status: 207 }); // 207 Multi-Status (부분 성공)
    }
  } catch (error) {
    console.error('크롤링 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '크롤링 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
