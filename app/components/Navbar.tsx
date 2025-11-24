'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Trash2, ChevronDown } from 'lucide-react';
import { signOut, deleteUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function Navbar() {
    const { user, loading } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        const confirmDelete = window.confirm(
            '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터(북마크, 읽은 기록 등)가 영구적으로 삭제됩니다.'
        );

        if (!confirmDelete) return;

        try {
            const uid = user.uid;

            // 1. Firestore 사용자 문서 삭제
            // (하위 컬렉션은 클라이언트에서 한 번에 삭제되지 않지만, 주요 진입점을 삭제)
            await deleteDoc(doc(db, 'users', uid));

            // 2. Auth 계정 삭제
            await deleteUser(user);

            alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
            router.push('/');
        } catch (error: any) {
            console.error('회원 탈퇴 실패:', error);
            if (error.code === 'auth/requires-recent-login') {
                alert('보안을 위해 다시 로그인한 후 탈퇴를 진행해주세요.');
                // 재로그인 유도 로직이 필요할 수 있음
            } else {
                alert('회원 탈퇴 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <header className="border-b-4 border-black bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-3xl">🤖</span>
                    <h1 className="text-2xl font-black">AI EDU NEWS</h1>
                </Link>

                <nav className="flex items-center gap-4">
                    {loading ? (
                        <div className="px-6 py-2 font-bold text-gray-400">
                            로딩 중...
                        </div>
                    ) : user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/ko/news"
                                className="px-4 py-2 font-bold hover:underline hidden md:block"
                            >
                                뉴스
                            </Link>
                            <Link
                                href="/ko/dashboard"
                                className="px-4 py-2 font-bold hover:underline hidden md:block"
                            >
                                대시보드
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <img
                                        src={user.photoURL || '/default-avatar.png'}
                                        alt={user.displayName || '사용자'}
                                        className="w-10 h-10 rounded-full border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                                        <div className="p-4 border-b-2 border-black bg-gray-50">
                                            <p className="font-bold text-sm text-gray-600">로그인 계정</p>
                                            <p className="font-black truncate">{user.email}</p>
                                        </div>
                                        <ul className="py-2">
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 font-bold text-left transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    로그아웃
                                                </button>
                                            </li>
                                            <li className="border-t-2 border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-100 text-red-600 font-bold text-left transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    회원 탈퇴
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 px-6 py-2 font-bold"
                        >
                            로그인
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
