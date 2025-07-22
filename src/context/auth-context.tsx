// src/context/auth-context.tsx

"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthState,
  AuthContextType,
  LoginCredentials,
  RegisterDetails,
} from "@/types/auth";
import { useRouter } from "next/navigation";

// Create a context with a default undefined value, the provider will supply the real value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state for our authentication
const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const router = useRouter();

  // Function to refresh auth state from token (e.g., on page load)
  const refreshAuth = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return;
    }

    // In a real app, you would verify the token with the backend.
    // Here, we'll decode it (for user info) and assume it's valid.
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Simple JWT decode
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          createdAt: "",
          updatedAt: "",
          isActive: false,
          role: "user",
        },
        token: token,
      });
    } catch (error) {
      console.error("Failed to decode token", error);
      localStorage.removeItem("authToken");
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    localStorage.setItem("authToken", data.token);
    await refreshAuth(); // Refresh state after getting token
  };

  const register = async (details: RegisterDetails) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    // Success! Redirect to login page for the user to log in.
    router.push("/login");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      token: null,
    });
    router.push("/login");
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
