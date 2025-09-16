export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(label) {
    this.metrics.set(label, { startTime: Date.now() });
  }

  endTimer(label) {
    const metric = this.metrics.get(label);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      return metric.duration;
    }
    return null;
  }

  getMetrics() {
    const result = {};
    for (const [label, metric] of this.metrics) {
      result[label] = metric.duration || 'running';
    }
    return result;
  }

  clear() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function withPerformanceMonitoring(handler, label) {
  return async (req, res) => {
    const requestId = generateSecureToken(8);
    const timerLabel = `${label || req.url}-${requestId}`;
    
    performanceMonitor.startTimer(timerLabel);
    
    try {
      const result = await handler(req, res);
      const duration = performanceMonitor.endTimer(timerLabel);
      
      logger.info('Request completed', {
        url: req.url,
        method: req.method,
        duration: `${duration}ms`,
        requestId
      });
      
      return result;
    } catch (error) {
      const duration = performanceMonitor.endTimer(timerLabel);
      
      logger.error('Request failed', error, {
        url: req.url,
        method: req.method,
        duration: `${duration}ms`,
        requestId
      });
      
      throw error;
    }
  };
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  // Validation
  validateStudyBlock,
  validateEmail,
  validatePassword,
  sanitizeInput,
  
  // Security
  generateSecureToken,
  hashPassword,
  verifyPassword,
  generateSalt,
  sanitizeHtml,
  isValidObjectId,
  
  // Error Handling
  AppError,
  handleApiError,
  
  // API Response
  ApiResponse,
  sendResponse,
  
  // Performance
  PerformanceMonitor,
  performanceMonitor,
  withPerformanceMonitoring,
  
  // Caching
  cache,
  withCache,
  
  // Database
  withTransaction,
  createAggregationPipeline,
  paginate,
  
  // Middleware
  withAuth,
  withRateLimit,
  withValidation,
  withErrorHandling,
  withMiddleware,
  
  // Utilities
  rateLimiter: rateLimit,
  logger,
  metrics,
  NotificationService,
  EmailProvider
};