// Simple in-memory rate limiter for development
const requests = new Map();

export function rateLimit(identifier, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  const userRequests = requests.get(identifier) || [];
  const recentRequests = userRequests.filter(time => time > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  requests.set(identifier, recentRequests);
  return true; // Request allowed
}