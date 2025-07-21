// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  code?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiValidationError extends ApiError {
  validationErrors: ValidationError[];
}

// HTTP Method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Route types
export interface ApiRouteContext {
  params: { [key: string]: string };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RequestBody<T = any> {
  [key: string]: T;
}

// File upload types
export interface FileUploadResponse {
  success: boolean;
  data?: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  };
  error?: string;
}

// Rate limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}