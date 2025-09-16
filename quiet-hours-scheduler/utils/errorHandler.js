export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleApiError(error, req, res) {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    error: 'Something went wrong',
    code: 'INTERNAL_ERROR'
  });
}
