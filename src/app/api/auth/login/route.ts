// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/mock-db'; // Or your actual user-finding logic
import { createToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // --- Add these logs ---
    console.log('\n--- LOGIN API ENDPOINT HIT ---');
    console.log('Received login request with body:', body);

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }
    
    const { email, password } = validation.data;
    
    const user = await db.user.findByEmail(email);

    // --- Critical Log #1 ---
    console.log(`Searching for user with email "${email}"... Found:`, user ? { id: user.id, email: user.email } : 'NO USER FOUND');

    if (!user) {
      console.log('REASON FOR 401: User with this email was not found in the database.');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // --- Critical Log #2 ---
    console.log(`Comparing form password with stored hash for user ${user.id}... Password is valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('REASON FOR 401: Passwords do not match (bcrypt.compare returned false).');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // --- If you reach here, login should be successful ---
    console.log('SUCCESS: User and password are valid. Creating token...');

    const { password: userPassword, ...userWithoutPassword } = user;
    const token = await createToken({ userId: user.id, name: user.name, email: user.email, role: user.role });

    return NextResponse.json({ 
        message: 'Login successful!',
        token: token,
        user: userWithoutPassword 
    });

  } catch (error) {
    if (error instanceof ZodError) { /* ... */ }
    console.error('CRITICAL ERROR in Login Route:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}