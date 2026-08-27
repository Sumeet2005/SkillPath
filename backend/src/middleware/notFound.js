/**
 * Not Found middleware for unhandled API routes.
 * Returns a 404 status code and structured JSON response.
 */
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
}

module.exports = notFound;
