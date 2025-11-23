/**
 * Firebase Admin SDK (서버 사이드)
 * Next.js API 라우트와 Firebase Functions에서 사용
 */

import 'server-only';
import * as admin from 'firebase-admin';

// Admin SDK 초기화 (싱글톤)
const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
let privateKey = rawKey;

if (privateKey) {
  // 1. 줄바꿈 문자 처리 (\\n -> \n)
  privateKey = privateKey.replace(/\\n/g, '\n');

  // 2. 앞뒤 따옴표 제거 (혹시 포함된 경우)
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
}

console.log('🔥 Firebase Admin Init Debug (v2):');
// console.log('Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
// console.log('Raw Key Exists:', !!rawKey);
// console.log('Processed Key Length:', privateKey?.length);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com`,
    });
    console.log('✅ Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Failed:', error);
    throw new Error(`Firebase Admin Init Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
