// src/lib/auth.ts

// --- THE CORE FIX IS HERE ---
// 1. Import the JWTPayload type directly from the 'jose' library.
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// 2. Define our application-specific payload by EXTENDING the library's base type.
// This means our UserJwtPayload is a valid JWTPayload AND has our custom fields.
interface UserJwtPayload extends JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// 3. The createToken function now expects our more specific payload type.
// This is fine because UserJwtPayload is a valid JWTPayload.
export async function createToken(payload: UserJwtPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  
  if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set!');
  }

  // No error here, because `payload` conforms to JWTPayload
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Token expires in 1 hour
    .sign(secret);
    
  return token;
}

// 4. The verifyToken function now correctly returns our more specific payload type.
export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  if (!token) {
    return null;
  }
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  
  try {
    const { payload } = await jwtVerify(token, secret);
    // The type assertion is now much safer because we are asserting
    // to a type that is a superset of the original.
    // We are essentially promising that the token contains our custom fields.
    return payload as UserJwtPayload;
  } catch (error) {
    // This will catch expired tokens, invalid signatures, etc.
    console.error("JWT Verification failed:", error);
    return null;
  }
}