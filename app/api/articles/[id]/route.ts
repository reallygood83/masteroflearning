/**
 * Article Data API
 * OG 이미지 생성을 위한 기사 데이터 제공
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleRef = adminDb.collection('articles').doc(params.id);
    const articleSnap = await articleRef.get();

    if (!articleSnap.exists) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const data = articleSnap.data();

    if (!data) {
      return NextResponse.json({ error: 'Article data is null' }, { status: 404 });
    }

    return NextResponse.json({
      id: articleSnap.id,
      feynmanTitle: data.feynmanTitle || '제목 없음',
      feynmanSummary: data.feynmanSummary || '',
      category: data.category || '기타',
      source: data.source || '출처 미상',
      difficultyLevel: data.difficultyLevel || 3,
      views: data.views || 0,
    });
  } catch (error) {
    console.error('기사 데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
