// Security utilities for the application

// Hash function for passwords (using a simple approach for demo)
// In a real application, use a proper library like bcrypt
export function hashPassword(password: string): string {
  // Simple hash function for demo purposes
  // In production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Generate secure tokens
export function generateSecureToken(): string {
  // In a real application, use a proper crypto library
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
}

// Sanitize input to prevent XSS while avoiding double encoding
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // First, decode any existing HTML entities to prevent double encoding
  let decoded = input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
  
  // Then encode special characters
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validate token format
export function validateTokenFormat(token: string): boolean {
  // Basic token format validation
  return typeof token === 'string' && token.length > 10;
}

// Rate limiting simulation
const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};

export function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore[identifier];
  
  if (!record || now - record.timestamp > windowMs) {
    rateLimitStore[identifier] = { count: 1, timestamp: now };
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  rateLimitStore[identifier].count++;
  return true;
}

// Clear old rate limit records
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  for (const key in rateLimitStore) {
    if (now - rateLimitStore[key].timestamp > windowMs) {
      delete rateLimitStore[key];
    }
  }
}

// Periodically clean up rate limit store
setInterval(cleanupRateLimitStore, 300000); // Every 5 minutes