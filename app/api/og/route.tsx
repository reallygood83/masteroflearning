/**
 * Dynamic OG Image Generator API
 * 각 기사마다 고유한 Open Graph 이미지 생성
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest) {
  console.log('[OG] Request received');

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('[OG] Article ID:', id);

    if (!id) {
      console.error('[OG] Missing article ID');
      return new Response('Missing article ID', { status: 400 });
    }

    // Firebase에서 기사 데이터 가져오기
    console.log('[OG] Fetching article data...');
    let article = await fetchArticleData(id);

    // 데이터를 가져오지 못한 경우 기본값 사용
    if (!article) {
      console.warn(`[OG] Article not found for ID: ${id}, using default`);
      article = {
        feynmanTitle: 'AI 교육 뉴스',
        feynmanSummary: '파인만 기법으로 쉽게 풀어드립니다',
        category: 'AI교육',
        source: 'AI EDU NEWS',
        difficultyLevel: 3,
        views: 0,
      };
    } else {
      console.log('[OG] Article data loaded:', article.feynmanTitle);
    }

    console.log('[OG] Generating image...');

    // 간단한 OG 이미지 생성
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            padding: '60px',
          }}
        >
          {/* 메인 카드 */}
          <div
            style={{
              background: 'white',
              border: '6px solid black',
              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* 로고 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                }}
              >
                🤖 AI EDU NEWS
              </div>
            </div>

            {/* 카테고리 */}
            <div
              style={{
                background: '#dbeafe',
                border: '3px solid black',
                padding: '10px 25px',
                fontSize: '24px',
                fontWeight: 900,
                marginBottom: '30px',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              {article.category}
            </div>

            {/* 제목 */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: '30px',
              }}
            >
              {article.feynmanTitle}
            </div>

            {/* 요약 */}
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                lineHeight: 1.4,
                color: '#374151',
                flex: 1,
              }}
            >
              {article.feynmanSummary.substring(0, 150)}
              {article.feynmanSummary.length > 150 ? '...' : ''}
            </div>

            {/* 하단 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '4px solid black',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              출처: {article.source}
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

    // 에러 발생 시에도 기본 이미지 반환
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fef3c7',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
            }}
          >
            🤖 AI EDU NEWS
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
      }
    );
  }
}

// Firebase에서 기사 데이터 가져오기
async function fetchArticleData(id: string) {
  try {
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
