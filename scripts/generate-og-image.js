/**
 * OG Image PNG Generator
 * HTML 파일을 PNG로 변환하는 스크립트
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function generateOGImage() {
  console.log('🚀 OG 이미지 생성 시작...');

  const browser = await puppeteer.launch({
    headless: 'new'
  });

  try {
    const page = await browser.newPage();

    // 1200x630 뷰포트 설정 (OG 이미지 표준 크기)
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2 // 레티나 디스플레이 대응
    });

    // HTML 파일 로드
    const htmlPath = path.join(__dirname, '../public/og-image.html');
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    console.log('📄 HTML 파일 로드 완료');

    // PNG로 스크린샷 캡처
    const outputPath = path.join(__dirname, '../public/og-image.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false // 뷰포트 크기만큼만 캡처
    });

    console.log('✅ OG 이미지 생성 완료:', outputPath);
    console.log('📊 크기: 1200 x 630 px (2x resolution)');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

generateOGImage().catch(console.error);
