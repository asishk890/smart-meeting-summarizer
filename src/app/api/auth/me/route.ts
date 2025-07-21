import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/mock-db';

export async function GET() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // THIS IS THE FIX:
    // We first check if verifiedToken itself is null (meaning the token was invalid).
    // Only if it's NOT null do we proceed to access its properties.
    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
       return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    
    // Now that we know verifiedToken is not null, we can safely access verifiedToken.userId
    const user = await db.user.findById(verifiedToken.userId);
    if (!user) {
       return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    // This catch block will now mostly handle unexpected server errors
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}