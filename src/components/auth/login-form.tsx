'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// We don't need axios anymore because our context handles the API call
// import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Lock } from 'lucide-react';
// The schema definition is better placed in the validations file itself.
import { loginSchema, LoginSchema } from '@/lib/validations'; // Assuming LoginSchema is exported from validations
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// --- This is the key change ---
// We get the `login` function, NOT `setAuthState`
import { useAuthContext } from '@/context/auth-context';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  // The router isn't even needed here anymore, our auth hooks will handle redirection!
  // const router = useRouter(); 
  
  // Get the login function from our context
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  // This function becomes much simpler
  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      // Call the login function from the context, which does everything.
      await login(data);
      
      toast.success('Login successful! Redirecting...');
      
      // We don't need router.push('/dashboard') here.
      // Why? Because when `login()` updates the auth state, our `useRedirectIfAuth`
      // hook in the login page will automatically detect the user is authenticated
      // and redirect them to the dashboard. The logic is now centralized and automatic.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // The login function in the context will throw an error on failure
      const errorMessage = error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-card p-8 shadow-md">
        <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              disabled={isLoading}
              className="pl-10 bg-background" 
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className="pl-10 bg-background"
            />
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => handleSocialLogin('Google')}>
          Google
        </Button>
        <Button variant="outline" onClick={() => handleSocialLogin('GitHub')}>
          GitHub
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don not have an account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
            Sign up
        </Link>
      </p>
    </div>
  );
}