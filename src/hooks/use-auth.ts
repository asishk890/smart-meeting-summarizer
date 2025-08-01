// src/hooks/use-auth.ts

'use client';

import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// A generic auth hook to access auth state and methods
export function useAuth(options: { requireAuth: boolean }) {
  const { authState, login, register, logout, refreshAuth } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is finished before checking authentication
    if (!authState.isLoading) {
      // If auth is required and user is not authenticated, redirect to login
      if (options.requireAuth && !authState.isAuthenticated) {
        router.push('/login');
      }
      // If auth is *not* required (e.g., on login/register page) and user *is* authenticated, redirect to dashboard
      if (!options.requireAuth && authState.isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [authState.isLoading, authState.isAuthenticated, options.requireAuth, router]);

  return {
    // Now these properties are correctly picked up from the context type!
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

// Hook for pages that require a user to be logged in
export function useRequireAuth() {
  return useAuth({ requireAuth: true });
}

// Hook for pages that should only be accessible to non-logged-in users (like login/register)
export function useRedirectIfAuth() {
  return useAuth({ requireAuth: false });
}

export { useAuthContext };
