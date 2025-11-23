/**
 * 뉴스 처리 API 엔드포인트
 * POST: 원본 뉴스를 Grok으로 Feynman 스타일 기사로 변환
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateFeynmanArticle } from '@/lib/grok-client';
import type { RawNews } from '@/types/firestore';

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Grok 처리 요청 시작...');

    const body = await request.json();
    const { newsIds, batchSize = 5 } = body;

    // 처리할 뉴스 가져오기 (Admin SDK 사용)
    if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'newsIds를 지정해주세요',
        data: { processed: 0, failed: 0 },
      }, { status: 400 });
    }

    // 특정 뉴스만 처리
    const newsPromises = newsIds.map(id =>
      adminDb.collection('raw_news').doc(id).get()
    );
    const newsDocs = await Promise.all(newsPromises);
    const rawNewsList = newsDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

    console.log(`📰 처리할 뉴스: ${rawNewsList.length}개`);

    if (rawNewsList.length === 0) {
      return NextResponse.json({
        success: true,
        message: '처리할 뉴스가 없습니다',
        data: { processed: 0, failed: 0 },
      });
    }

    // 배치 처리 → 순차 처리로 변경 (안정성 향상)
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
    };

    // 한 번에 하나씩 순차적으로 처리
    for (const rawNews of rawNewsList) {
      try {
        console.log(`🔄 처리 중 (${results.processed + 1}/${rawNewsList.length}): ${rawNews.title}`);

        // publishedAt을 문자열로 변환
        const newsForGrok = {
          ...rawNews,
          publishedAt: typeof rawNews.publishedAt === 'string'
            ? rawNews.publishedAt
            : rawNews.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };

        // Grok으로 Feynman 기사 생성
        const feynmanArticle = await generateFeynmanArticle(newsForGrok);

        // Firestore에 저장 (Admin SDK)
        const articleRef = adminDb.collection('articles').doc();
        await articleRef.set({
          ...feynmanArticle,
          rawNewsId: rawNews.id,
          originalTitle: rawNews.title,
          originalUrl: rawNews.url,
          source: rawNews.source,
          category: rawNews.category,
          country: rawNews.country,
          publishedAt: rawNews.publishedAt?.toDate?.() || new Date(rawNews.publishedAt),
          processedAt: new Date(),
          status: 'published',
          views: 0,
        });

        // 원본 뉴스를 처리됨으로 표시
        const rawNewsRef = adminDb.collection('raw_news').doc(rawNews.id);
        await rawNewsRef.update({
          status: 'processed',
          processed: true,
          processedAt: new Date(),
          articleId: articleRef.id,
        });

        results.processed++;
        console.log(`✅ 처리 완료 (${results.processed}/${rawNewsList.length}): ${feynmanArticle.feynmanTitle}`);

        // 각 기사 처리 후 2초 대기 (API Rate Limit 방지)
        if (results.processed < rawNewsList.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        results.failed++;
        const errorMsg = `${rawNews.title}: ${error instanceof Error ? error.message : String(error)}`;
        results.errors.push(errorMsg);
        console.error(`❌ 처리 실패: ${errorMsg}`);

        // 오류 발생 시에도 계속 진행
        continue;
      }
    }

    return NextResponse.json({
      success: results.failed === 0,
      message: `${results.processed}개 처리 완료, ${results.failed}개 실패`,
      data: results,
    });
  } catch (error) {
    console.error('뉴스 처리 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '뉴스 처리 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
