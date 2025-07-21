import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase, one uppercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Meeting Schemas
export const meetingCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional(),
});

export const meetingUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional(),
  status: z
    .enum(['uploading', 'processing', 'completed', 'failed'])
    .optional(),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, 'File is required')
    .refine((file) => file?.size <= 50 * 1024 * 1024, 'File size must be less than 50MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'audio/mpeg',
          'audio/wav',
          'audio/mp4',
          'audio/m4a',
          'audio/webm',
          'video/mp4',
          'video/webm',
        ];
        return allowedTypes.includes(file?.type);
      },
      'File must be an audio or video file'
    ),
});

// AI Processing Schemas
export const transcriptionSchema = z.object({
  audioFile: z.any().refine((file) => file instanceof File, 'Audio file is required'),
  language: z.string().optional(),
});

export const summarizationSchema = z.object({
  transcript: z
    .string()
    .min(10, 'Transcript must be at least 10 characters')
    .max(50000, 'Transcript is too long'),
  meetingTitle: z.string().optional(),
  additionalContext: z.string().max(1000).optional(),
});

// Query Parameter Schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const meetingFiltersSchema = z.object({
  status: z.enum(['uploading', 'processing', 'completed', 'failed']).optional(),
  searchTerm: z.string().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// API Response Schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
});


// THIS IS THE FIX: We are now exporting the TypeScript types
// that can be inferred from the Zod schemas.

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MeetingCreateInput = z.infer<typeof meetingCreateSchema>;
export type MeetingUpdateInput = z.infer<typeof meetingUpdateSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type TranscriptionInput = z.infer<typeof transcriptionSchema>;
export type SummarizationInput = z.infer<typeof summarizationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type MeetingFiltersInput = z.infer<typeof meetingFiltersSchema>;