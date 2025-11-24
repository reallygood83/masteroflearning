# Firestore Security Rules 배포 가이드

## 1. Firebase CLI 설치 (이미 설치되어 있다면 생략)
```bash
npm install -g firebase-tools
```

## 2. Firebase 로그인
```bash
firebase login
```

## 3. Firebase 프로젝트 초기화 (이미 되어 있다면 생략)
```bash
firebase init firestore
# Firestore Rules 파일: firestore.rules
# Firestore Indexes 파일: firestore.indexes.json
```

## 4. Firestore Rules 배포
```bash
firebase deploy --only firestore:rules
```

## 5. 관리자 계정 설정 (중요!)
보안 규칙 배포 전에 반드시 관리자 계정을 설정해야 합니다.

### 방법 1: Firebase Console에서 수동 설정
1. Firebase Console → Firestore Database
2. `users` 컬렉션에서 본인 계정 찾기
3. 필드 추가: `admin: true` (boolean)

### 방법 2: 코드로 설정 (한 번만 실행)
```typescript
// 임시로 사용할 스크립트
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 본인의 UID를 여기에 입력
const adminUid = 'YOUR_UID_HERE';

await updateDoc(doc(db, 'users', adminUid), {
  admin: true
});
```

## 주요 보안 규칙 설명

### Articles (기사)
- ✅ 모든 사용자: published 상태 기사 읽기 가능
- ✅ 관리자만: 기사 생성/수정/삭제
- ✅ 인증된 사용자: 조회수 증가 가능

### Users (사용자)
- ✅ 본인만: 자신의 데이터 읽기/쓰기
- ✅ 본인만: 북마크, 읽기 기록 관리

### Crawl Logs (크롤링 로그)
- ✅ 관리자만: 읽기/쓰기

## 테스트 방법
1. 로그아웃 상태에서 뉴스 목록 접근 → 실패해야 함
2. 로그인 후 뉴스 목록 접근 → 성공
3. 일반 사용자로 기사 생성 시도 → 실패해야 함
4. 관리자 계정으로 기사 생성 → 성공

## 주의사항
⚠️ 보안 규칙 배포 전에 반드시 관리자 계정을 설정하세요!
⚠️ 그렇지 않으면 크롤러가 작동하지 않습니다.
