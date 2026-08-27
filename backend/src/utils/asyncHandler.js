/**
 * Async handler wrapper to catch unhandled promise rejections
 * and forward them to Express error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
