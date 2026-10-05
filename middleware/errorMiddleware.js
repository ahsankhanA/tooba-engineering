/**
 * Centralized Error Handling Middleware
 * Ensures:
 * 1. Stack traces and internal server paths are never exposed in production.
 * 2. Predictable, standardized JSON structure for all API errors.
 * 3. Handles common Mongoose errors (CastError, ValidationError, DuplicateKey 11000).
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected internal server error occurred.';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with identifier: ${err.value}`;
  }

  // Handle Mongoose Schema Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = `Validation Failed: ${errors.join(', ')}`;
  }

  // Handle MongoDB Duplicate Key (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate record conflict: The provided ${duplicateField} already exists in the system.`;
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication failed: Invalid authorization token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication failed: Authorization token has expired. Please log in again.';
  }

  // Secure structured logging without leaking sensitive values
  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[API ERROR ${statusCode}] [${req.method} ${req.originalUrl}] - Message: ${message}`);
  
  if (!isProduction && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
