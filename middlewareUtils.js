import { rateLimit } from './rateLimiter.js';
import { validateStudyBlock } from './utils/validation.js';
import { logger } from './utils/logger.js';


export function withAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED' 
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ 
          error: 'Invalid authentication',
          code: 'AUTH_INVALID' 
        });
      }

      req.user = user;
      return handler(req, res);

    } catch (error) {
      logger.error('Authentication middleware error', error);
      return res.status(500).json({ 
        error: 'Authentication error',
        code: 'AUTH_ERROR' 
      });
    }
  };
}

export function withRateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return (handler) => {
    return async (req, res) => {
      const identifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
      
      if (!rateLimit(identifier, maxRequests, windowMs)) {
        return res.status(429).json({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      return handler(req, res);
    };
  };
}

export function withValidation(validationFn) {
  return (handler) => {
    return async (req, res) => {
      if (req.method === 'POST' || req.method === 'PUT') {
        const validation = validationFn(req.body);
        
        if (!validation.isValid) {
          return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.errors
          });
        }
      }

      return handler(req, res);
    };
  };
}

export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      logger.error('API Error', error, {
        url: req.url,
        method: req.method,
        userId: req.user?.id
      });

      if (error.isOperational) {
        return res.status(error.statusCode).json({
          error: error.message,
          code: error.code
        });
      }

      return res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}

// Compose all middleware
export function withMiddleware(handler, options = {}) {
  let wrappedHandler = handler;

  // Apply middleware in reverse order (last applied runs first)
  if (options.errorHandling !== false) {
    wrappedHandler = withErrorHandling(wrappedHandler);
  }

  if (options.validation) {
    wrappedHandler = withValidation(options.validation)(wrappedHandler);
  }

  if (options.auth !== false) {
    wrappedHandler = withAuth(wrappedHandler);
  }

  if (options.rateLimit !== false) {
    const { maxRequests, windowMs } = options.rateLimit || {};
    wrappedHandler = withRateLimit(maxRequests, windowMs)(wrappedHandler);
  }

  return wrappedHandler;
}
