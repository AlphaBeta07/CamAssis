/**
 * Centralized Production Error Handler for CamAssis
 * Sanitizes errors, suppresses sensitive tokens in production,
 * and provides safe, user-friendly error feedback.
 */

export type ErrorCategory =
  | 'AUTH'
  | 'BACKEND'
  | 'CAMERA'
  | 'AI'
  | 'PERMISSIONS'
  | 'IMAGE_PROCESSING'
  | 'PHOTO_SAVING'
  | 'NETWORK'
  | 'STORAGE';

export interface AppError {
  category: ErrorCategory;
  message: string;
  originalError?: unknown;
  timestamp: string;
}

const USER_FRIENDLY_MESSAGES: Record<ErrorCategory, string> = {
  AUTH: 'Authentication issue. Please verify your credentials or sign in again.',
  BACKEND: 'Unable to reach the server. Falling back to offline pose library.',
  CAMERA: 'Camera hardware encountered an issue. Please restart the camera view.',
  AI: 'AI pose detection is temporarily adjusting. Camera remains fully operational.',
  PERMISSIONS: 'Required permission was not granted. Please enable access in device Settings.',
  IMAGE_PROCESSING: 'Could not process the selected image. Please choose another photo.',
  PHOTO_SAVING: 'Could not save photo to your device gallery. Please check storage permissions.',
  NETWORK: 'Network connection is unavailable. Operating in offline mode.',
  STORAGE: 'Local storage issue encountered.',
};

/**
 * Sanitizes an error message by stripping potential keys, tokens, or URLs.
 */
export function sanitizeErrorMessage(rawMessage: string): string {
  if (!rawMessage) return 'An unexpected error occurred.';

  // Strip Supabase anon keys or JWTs
  let clean = rawMessage.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_TOKEN]');
  // Strip UUIDs / IDs if sensitive
  clean = clean.replace(/https:\/\/[a-zA-Z0-9.-]+\.supabase\.co/g, '[SUPABASE_ENDPOINT]');
  return clean;
}

export function logError(category: ErrorCategory, error: unknown, customMessage?: string): AppError {
  const timestamp = new Date().toISOString();
  const rawMsg = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
  const sanitized = sanitizeErrorMessage(rawMsg);

  if (__DEV__) {
    console.error(`[${category}] ${customMessage ? customMessage + ': ' : ''}${sanitized}`, error);
  } else {
    // In production, keep logs clean and devoid of private data
    console.warn(`[${category}] ${customMessage || sanitized}`);
  }

  return {
    category,
    message: customMessage || USER_FRIENDLY_MESSAGES[category] || sanitized,
    originalError: __DEV__ ? error : undefined,
    timestamp,
  };
}

export function getUserFacingMessage(category: ErrorCategory, fallback?: string): string {
  return fallback || USER_FRIENDLY_MESSAGES[category] || 'An unexpected error occurred. Please try again.';
}
