/**
 * Firebase Authentication Context
 * Google OAuth 인증 상태 관리
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // 사용자 프로필 가져오기 또는 생성
  const fetchOrCreateUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // 기존 사용자
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // 신규 사용자 - Firestore에 저장
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          photoURL: user.photoURL || '',
          role: user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('프로필 가져오기 오류:', error);
    }
  };

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        await fetchOrCreateUserProfile(user);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user,
    userProfile,
    loading: loading || initializing,
    signInWithGoogle,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
