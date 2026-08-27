/**
 * Production-quality centralized error handling middleware.
 * Formats errors consistently, returns proper HTTP status codes,
 * and hides sensitive stack traces in production.
 */
function errorHandler(err, req, res, next) {
  // Default status code to 500 if not specified
  const statusCode = err.statusCode || err.status || 500;
  
  // Format clean error message
  const response = {
    success: false,
    message: err.message || "An unexpected internal server error occurred.",
  };

  // Log error for internal monitoring (avoid exposing sensitive details to client)
  if (statusCode >= 500) {
    console.error(`[Error 500] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
