/**
 * Dynamic OG Image Generator API
 * 각 기사마다 고유한 Open Graph 이미지 생성
 * Neo-Brutalism 디자인 스타일 적용
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// OG 이미지 크기 (Open Graph 표준)
const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing article ID', { status: 400 });
    }

    // Firebase에서 기사 데이터 가져오기
    const article = await fetchArticleData(id);

    if (!article) {
      return new Response('Article not found', { status: 404 });
    }

    // Neo-Brutalism 스타일 OG 이미지 생성
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* 배경 패턴 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* 메인 컨텐츠 카드 */}
          <div
            style={{
              background: 'white',
              border: '6px solid black',
              boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              position: 'relative',
            }}
          >
            {/* 헤더: 로고 + 카테고리 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '48px' }}>🤖</span>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    color: 'black',
                  }}
                >
                  AI EDU NEWS
                </span>
              </div>
              <div
                style={{
                  background: getCategoryColor(article.category),
                  border: '3px solid black',
                  padding: '10px 25px',
                  fontSize: '24px',
                  fontWeight: 900,
                }}
              >
                {article.category}
              </div>
            </div>

            {/* 난이도 배지 */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <div
                style={{
                  background: getDifficultyColor(article.difficultyLevel),
                  border: '3px solid black',
                  padding: '8px 20px',
                  fontSize: '20px',
                  fontWeight: 900,
                }}
              >
                {getDifficultyLabel(article.difficultyLevel)}
              </div>
            </div>

            {/* 기사 제목 */}
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: '30px',
                color: 'black',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {article.feynmanTitle}
            </h1>

            {/* 요약 */}
            <p
              style={{
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.4,
                color: '#374151',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              {article.feynmanSummary}
            </p>

            {/* 푸터: 출처 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '4px solid black',
              }}
            >
              <div
                style={{
                  background: '#dbeafe',
                  border: '2px solid black',
                  padding: '8px 20px',
                  fontSize: '20px',
                  fontWeight: 900,
                }}
              >
                출처: {article.source}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#6b7280',
                }}
              >
                조회수 {article.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 하단 브랜드 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '30px',
            }}
          >
            <div
              style={{
                background: 'white',
                border: '4px solid black',
                padding: '15px 40px',
                fontSize: '24px',
                fontWeight: 900,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              }}
            >
              news.teaboard.link
            </div>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
      }
    );
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

// Firebase에서 기사 데이터 가져오기
async function fetchArticleData(id: string) {
  try {
    // Firebase Admin SDK를 사용한 서버사이드 데이터 페칭
    const response = await fetch(`https://news.teaboard.link/api/articles/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Firebase fetch error:', error);
    return null;
  }
}

// 카테고리별 색상
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    AI교육: '#dbeafe',
    에듀테크: '#fae8ff',
    교육정책: '#fef9c3',
    교육혁신: '#fecdd3',
    디지털리터러시: '#cffafe',
    학습도구: '#e0e7ff',
  };
  return colors[category] || '#f3f4f6';
}

// 난이도별 색상
function getDifficultyColor(level: number): string {
  const colors: Record<number, string> = {
    1: '#bbf7d0',
    2: '#86efac',
    3: '#fef08a',
    4: '#fdba74',
    5: '#fca5a5',
  };
  return colors[level] || '#e5e7eb';
}

// 난이도 라벨
function getDifficultyLabel(level: number): string {
  const labels: Record<number, string> = {
    1: '매우 쉬움',
    2: '쉬움',
    3: '보통',
    4: '어려움',
    5: '매우 어려움',
  };
  return labels[level] || '보통';
}
