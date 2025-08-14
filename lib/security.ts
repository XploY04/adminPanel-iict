// Security configuration constants
export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT_EXPIRY: "2h", // Reduced from 24h for better security

  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },

  // Password Requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_HASH_ROUNDS: 12,

  // Session Security
  SECURE_COOKIES: process.env.NODE_ENV === "production",
  SAME_SITE: "strict" as const,

  // CORS Configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],

  // Security Headers
  SECURITY_HEADERS: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  },

  // Content Security Policy
  CSP: {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'"],
    "frame-ancestors": ["'none'"],
  },
} as const;

// Input validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MONGODB_OBJECT_ID: /^[0-9a-fA-F]{24}$/,
} as const;

// Security utility functions
export function isValidObjectId(id: string): boolean {
  return VALIDATION_PATTERNS.MONGODB_OBJECT_ID.test(id);
}

export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

// Generate CSP header value
export function generateCSPHeader(): string {
  return Object.entries(SECURITY_CONFIG.CSP)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
