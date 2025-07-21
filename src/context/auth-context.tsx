'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ================= THE FIX IS HERE ==================
// We are telling TypeScript what the shape of our context value is.
// It was missing the `setAuthState` function.
export interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>; // <-- Add this line
  logout: () => void;
}
// ==================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  // ... (rest of the file remains the same)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        if (data.user) {
          setAuthState({ user: data.user, isAuthenticated: true, isLoading: false });
        } else {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    checkUser();
  }, []);

  const logout = () => {
    axios.post('/api/auth/logout');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    router.push('/login');
  };

  // ...

  // Here we are providing the value, which now correctly matches the type.
  const value = { authState, setAuthState, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};