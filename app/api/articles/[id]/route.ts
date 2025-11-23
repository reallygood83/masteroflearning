/**
 * Article Data API
 * OG 이미지 생성을 위한 기사 데이터 제공
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleRef = doc(db, 'articles', params.id);
    const articleSnap = await getDoc(articleRef);

    if (!articleSnap.exists()) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const data = articleSnap.data();

    return NextResponse.json({
      id: articleSnap.id,
      feynmanTitle: data.feynmanTitle,
      feynmanSummary: data.feynmanSummary,
      category: data.category,
      source: data.source,
      difficultyLevel: data.difficultyLevel,
      views: data.views || 0,
    });
  } catch (error) {
    console.error('기사 데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
