'use client';

import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth: boolean = true) {
  const { authState, login, register, logout, refreshAuth } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading) {
      if (requireAuth && !authState.isAuthenticated) {
        router.push('/auth/login');
      } else if (!requireAuth && authState.isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [authState.isLoading, authState.isAuthenticated, requireAuth, router]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    login,
    register,
    logout,
    refreshAuth,
  };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useAuthOptional() {
  return useAuth(false);
}