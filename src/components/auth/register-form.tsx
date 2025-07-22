'use client'

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerSchema, RegisterSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthContext } from '@/context/auth-context';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);
    try {
      // Omit confirmPassword before sending to the API, as the API doesn't need it.
      const { confirmPassword, ...submissionData } = data;
      await registerUser(data);
      toast.success('Registration successful! Please log in.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} disabled={isLoading} />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} disabled={isLoading} />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} disabled={isLoading} />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        {/*
          --- THE FIX IS RIGHT HERE ---
          Ensure this line says `register('confirmPassword')` and not `register('password')`.
        */}
        <Input id="confirmPassword" type="password" {...register('confirmPassword')} disabled={isLoading} />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  )
}