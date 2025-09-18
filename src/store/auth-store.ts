import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  profileImage?: string;
}

interface AuthState {
  // 상태
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // 액션
  setAuth: (token: string, user?: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

// 메모리에만 저장 (persist 제거)
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      // 초기 상태
      token: null,
      user: null,
      isAuthenticated: false,

      // 로그인 시 토큰과 유저 정보 저장 (메모리에만)
      setAuth: (token, user) =>
        set({
          token,
          user: user || null,
          isAuthenticated: true
        }),

      // 로그아웃 시 상태 초기화
      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false
        }),

      // 유저 정보 업데이트
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
    }),
    {
      name: 'AuthStore'
    }
  )
);