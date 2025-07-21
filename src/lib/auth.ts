import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Function to create a JWT token
export async function createToken(payload: { userId: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key);
  
  return session;
}

// Function to verify a token and get the session payload
// This is the `verifyAuth` function your app is looking for.
export async function verifyAuth(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    // Type assertion to ensure the payload has a userId
    return payload as { userId: string };
  } catch (error) {
    // This will happen if the token is invalid or expired
    console.error('Token verification failed:', error);
    return null;
  }
}

// Helper function to get the user ID from an incoming request's cookie
export async function getUserIdFromRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token) {
    const verifiedToken = await verifyAuth(token);
    if (verifiedToken) {
      return verifiedToken.userId;
    }
  }

  return null;
}