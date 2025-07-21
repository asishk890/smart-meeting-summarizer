import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { User, TokenPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-characters'
);

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static async generateToken(user: User): Promise<string> {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Token expires in 7 days
      .sign(JWT_SECRET);

    return token;
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as TokenPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Validate token and get user info
  static async validateTokenAndGetUser(authHeader: string | null): Promise<TokenPayload | null> {
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) return null;

    return this.verifyToken(token);
  }

  // Generate refresh token (for future use)
  static async generateRefreshToken(userId: string): Promise<string> {
    const payload = { userId, type: 'refresh' };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // Refresh token expires in 30 days
      .sign(JWT_SECRET);

    return token;
  }

  // Sanitize user data (remove sensitive info)
  static sanitizeUser(user: User): Omit<User, 'password'> {
    const { ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Check if user has required role
  static hasRole(userRole: string, requiredRole: string | string[]): boolean {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  }

  // Generate random string for various purposes
  static generateRandomString(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Rate limiting helper
  private static attemptCounts = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const attempt = this.attemptCounts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      // Reset or initialize
      const resetTime = now + windowMs;
      this.attemptCounts.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: maxAttempts - 1, resetTime };
    }

    if (attempt.count >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime: attempt.resetTime };
    }

    // Increment count
    attempt.count += 1;
    this.attemptCounts.set(identifier, attempt);

    return {
      allowed: true,
      remaining: maxAttempts - attempt.count,
      resetTime: attempt.resetTime,
    };
  }

  // Clean up expired rate limit entries
  static cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, value] of this.attemptCounts.entries()) {
      if (now > value.resetTime) {
        this.attemptCounts.delete(key);
      }
    }
  }
}