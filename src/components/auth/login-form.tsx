'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Mail, Lock } from 'lucide-react' // Import icons
import { loginSchema, LoginSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useAuthContext } from '@/context/auth-context'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setAuthState } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/login', data)
      toast.success(response.data.message)
      setAuthState({ user: response.data.user, isAuthenticated: true, isLoading: false });
      router.push('/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  };
  
  // Fake handler for social logins to show functionality
  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input with Icon */}
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
              className="pl-10" // Add padding to make space for the icon
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        {/* Password Input with Icon and Forgot Password Link */}
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
                  className="pl-10"
                />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Login
        </Button>
      </form>

      {/* "OR CONTINUE WITH" Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => handleSocialLogin('Google')}>
          {/* In a real app, you'd use a Google icon here */}
          Google
        </Button>
        <Button variant="outline" onClick={() => handleSocialLogin('GitHub')}>
          {/* In a real app, you'd use a GitHub icon here */}
          GitHub
        </Button>
      </div>
    </div>
  )
}