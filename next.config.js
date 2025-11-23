/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // i18n config removed - using App Router manual locale structure with /ko/ folders

  // UTF-8 인코딩 강제 설정
  webpack: (config, { isServer }) => {
    // 한글 문자열이 올바르게 처리되도록 설정
    config.output = config.output || {};
    config.output.charset = false; // Unicode 이스케이프 비활성화

    // 클라이언트 번들에서 서버 사이드 모듈 제외
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false, // firebase-admin 의존성 제외
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        perf_hooks: false,
      };
    }

    return config;
  },

  // 환경 변수
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // 이미지 최적화
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
    ],
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },

  // 리다이렉트
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ko',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
