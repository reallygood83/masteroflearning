/**
 * 관리자 설정 API
 * xAI API 키 저장 및 불러오기
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET: API 키 불러오기 (마스킹 처리)
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 환경에서는 NextAuth 세션 확인
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    // }

    // Firestore에서 설정 불러오기
    const settingsRef = doc(db, 'settings', 'xai');
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      const apiKey = settingsSnap.data().apiKey || '';

      // 마지막 4자리만 반환 (보안)
      return NextResponse.json({
        xaiApiKey: apiKey ? '****' + apiKey.slice(-4) : '',
      });
    }

    return NextResponse.json({ xaiApiKey: '' });
  } catch (error) {
    console.error('설정 불러오기 오류:', error);
    return NextResponse.json(
      { error: '설정을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// POST: API 키 저장
export async function POST(request: NextRequest) {
  try {
    // TODO: 실제 환경에서는 NextAuth 세션 확인
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    // }

    const body = await request.json();
    const { xaiApiKey } = body;

    if (!xaiApiKey || typeof xaiApiKey !== 'string') {
      return NextResponse.json(
        { error: 'API 키가 유효하지 않습니다' },
        { status: 400 }
      );
    }

    // API 키 형식 검증 (xai-로 시작하는지 확인)
    if (!xaiApiKey.startsWith('xai-')) {
      return NextResponse.json(
        { error: 'xAI API 키는 "xai-"로 시작해야 합니다' },
        { status: 400 }
      );
    }

    // Firestore에 저장
    const settingsRef = doc(db, 'settings', 'xai');
    await setDoc(settingsRef, {
      apiKey: xaiApiKey,
      updatedAt: new Date(),
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'API 키가 저장되었습니다',
    });
  } catch (error) {
    console.error('API 키 저장 오류:', error);
    return NextResponse.json(
      { error: 'API 키를 저장할 수 없습니다' },
      { status: 500 }
    );
  }
}
