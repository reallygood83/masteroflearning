# Favicon 파일 정보

## 생성된 파일들

### 1. favicon.svg
- **크기**: 벡터 (무한 확장 가능)
- **용도**: 최신 브라우저에서 자동으로 다양한 크기로 렌더링
- **위치**: `/public/favicon.svg`
- **특징**: Neo-brutalism 스타일, 교육(🎓) + AI(🤖) + 아이디어(💡) 심볼 조합

### 2. og-image.html
- **크기**: 1200x630px (소셜 미디어 표준)
- **용도**: Facebook, Twitter, KakaoTalk 등 SNS 공유 시 미리보기 이미지
- **위치**: `/public/og-image.html`
- **특징**:
  - 3가지 핵심 기능 강조
  - Neo-brutalism 디자인 (bold borders, vibrant shadows)
  - 한국어 기반 설명

## PNG/ICO 변환 필요

현재 HTML과 SVG 파일만 생성되었습니다. 실제 사용을 위해서는:

### OG Image PNG 생성 방법
1. `og-image.html`을 브라우저에서 열기
2. 브라우저 개발자 도구로 1200x630px 스크린샷 캡처
3. `og-image.png`로 저장

또는 온라인 도구 사용:
- https://html-to-image.com/
- https://www.screely.com/

### Favicon ICO 생성 방법
1. `favicon.svg`를 브라우저에서 열기
2. 다음 크기로 PNG 내보내기:
   - 16x16px → `favicon-16x16.png`
   - 32x32px → `favicon-32x32.png`
   - 192x192px → `android-chrome-192x192.png`
   - 512x512px → `android-chrome-512x512.png`
   - 180x180px → `apple-touch-icon.png`

3. 온라인 ICO 변환기 사용:
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

## 디자인 개념

### 색상 팔레트
- **Primary**: #FFE66D (밝은 노란색) - 긍정적 에너지
- **Secondary**: #FF6B9D (분홍색) - 창의성과 열정
- **Accent**: #C779FF (보라색) - 혁신과 미래
- **Text**: #000000 (검정) - Neo-brutalism의 필수 요소

### 심볼 의미
- 🎓 **Graduation Cap**: 교육과 학습
- 🤖 **Robot**: AI 기술
- 💡 **Light Bulb**: 아이디어와 이해 (파인만 기법)

### Neo-Brutalism 요소
- 두꺼운 검정 테두리 (8px)
- 강렬한 그림자 효과
- 높은 대비 색상
- 기하학적 도형
- 플랫한 디자인 (gradients는 배경에만)
