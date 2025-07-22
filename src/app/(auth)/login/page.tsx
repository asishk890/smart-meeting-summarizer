"use client"; // <-- STEP 1: Add this directive

import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import { useRedirectIfAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner"; // Import a spinner for loading

export default function LoginPage() {
  // STEP 2: Properly use the hook and its return values
  const { isLoading } = useRedirectIfAuth();

  // STEP 3: Handle the loading state
  // This prevents the login form from flashing on the screen for a user
  // who is about to be redirected.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  // The rest of your component, which will now only render when auth state is confirmed
  return <LoginForm />;
}
