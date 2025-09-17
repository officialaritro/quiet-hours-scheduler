export class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static error(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    return {
      success: false,
      statusCode,
      error: {
        message,
        code,
        details
      },
      timestamp: new Date().toISOString()
    };
  }

  static paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    };
  }
}

export function sendResponse(res, response) {
  return res.status(response.statusCode).json(response);
}