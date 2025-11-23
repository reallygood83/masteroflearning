/**
 * Root Layout
 * - Global styles
 * - NextAuth SessionProvider
 * - Neo-Brutalism Design System
 */

import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import Footer from '@/components/common/Footer';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // Base URL for absolute paths (required for OG images)
  metadataBase: new URL('https://news.teaboard.link'),

  // 기본 메타데이터
  title: {
    default: 'AI 교육 뉴스, 쉽게 읽자! | Feynman AI News',
    template: '%s | Feynman AI News',
  },
  description: 'AI와 교육 뉴스를 파인만 기법으로 쉽게 설명합니다. xAI Grok이 복잡한 개념을 초등학생도 이해할 수 있게 변환하여 교사, 학생, 학부모에게 전달합니다. 매일 새로운 인사이트를 만나보세요.',
  keywords: [
    'AI 교육',
    '파인만 기법',
    '쉬운 설명',
    '교육 뉴스',
    'AI 뉴스',
    'xAI Grok',
    '교사',
    '학생',
    '학부모',
    '인공지능 교육',
    '에듀테크',
    '교육 기술',
    '초등학생',
    '이해하기 쉬운',
    '교육 인사이트',
    '수업 자료',
    '최신 교육',
    '교육 트렌드',
    '리처드 파인만',
    '개념 설명',
  ],
  authors: [{ name: 'Feynman AI News' }],
  creator: 'Feynman AI News',
  publisher: 'Feynman AI News',

  // Open Graph (Facebook, KakaoTalk 등)
  openGraph: {
    title: 'AI 교육 뉴스, 쉽게 읽자!',
    description:
      '복잡한 AI와 교육 뉴스, 이제 쉽게 이해하세요! 노벨상 수상자 리처드 파인만의 설명법으로 최신 뉴스를 재해석합니다. xAI Grok 기술로 어려운 개념을 일상적인 비유로 풀어내어 누구나 쉽게 배울 수 있습니다. 교사의 수업 준비부터 학생의 호기심 해결까지, 교육 현장에 필요한 인사이트를 제공합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Feynman AI News',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Feynman AI News - AI 교육 뉴스를 파인만 기법으로',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AI 교육 뉴스, 쉽게 읽자!',
    description:
      '🎓 AI 뉴스, 쉽게 읽자! 🤖 파인만 기법으로 복잡한 개념을 초등학생도 이해할 수 있게 설명합니다. xAI Grok이 매일 새로운 AI와 교육 뉴스를 쉬운 언어로 변환하여 전달합니다. 교사, 학생, 학부모 모두를 위한 교육 인사이트 플랫폼입니다.',
    images: ['/og-image.png'],
    creator: '@feynman_ai_news',
  },

  // 파비콘 및 아이콘
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },

  // 추가 메타데이터
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://news.teaboard.link',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },

  other: {
    charset: 'utf-8',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <div className="flex-1">
          <Providers>{children}</Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
}
