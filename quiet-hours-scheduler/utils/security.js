import crypto from 'crypto';

export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password, salt, hash) {
  const hashedPassword = hashPassword(password, salt);
  return hashedPassword === hash;
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function sanitizeHtml(html) {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
