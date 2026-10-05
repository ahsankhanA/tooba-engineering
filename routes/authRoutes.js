const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Brute-Force & Credential-Stuffing Defense:
 * Strict Rate Limiter for Login Endpoint.
 * Restricts an IP to 5 login requests per 15-minute window.
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many login attempts from this IP address. Please try again after 15 minutes.',
      statusCode: 429,
    },
  },
  skipSuccessfulRequests: false, // Count all attempts to prevent password spraying
});

// Authentication Routes
router.post('/login', loginRateLimiter, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

module.exports = router;
