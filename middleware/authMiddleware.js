const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware:
 * Verifies JWT token from:
 * 1. Secure HttpOnly Cookie (Primary for web client)
 * 2. Authorization Bearer Header (Secondary fallback for API/mobile requests)
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization Header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access Denied: No authentication token provided. Please log in.',
          statusCode: 401,
        },
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[SECURITY CRITICAL] JWT_SECRET is not configured in process.env.');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal authentication service misconfiguration.',
          statusCode: 500,
        },
      });
    }

    // Verify token cryptographic signature and expiration
    const decoded = jwt.verify(token, secret);

    // Verify user exists and is active in database
    const user = await User.findById(decoded.id).select('-passwordHash').lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User account associated with this session no longer exists.',
          statusCode: 401,
        },
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is deactivated. Please contact the CEO office.',
          statusCode: 403,
        },
      });
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const waitMinutes = Math.ceil((new Date(user.lockUntil).getTime() - Date.now()) / (60 * 1000));
      return res.status(403).json({
        success: false,
        error: {
          message: `Account is temporarily locked due to excessive failed attempts. Try again in ${waitMinutes} minutes.`,
          statusCode: 403,
        },
      });
    }

    // Attach verified user payload to request
    req.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Session expired. Please log in again.',
          statusCode: 401,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or forged authorization token.',
        statusCode: 401,
      },
    });
  }
};

/**
 * Generic Role Authorization Guard
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required before permission verification.',
          statusCode: 401,
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your current role is '${req.user.role}'.`,
          statusCode: 403,
        },
      });
    }

    next();
  };
};

/**
 * ADMIN Authorization Middleware (Tayyab - Daily Operations)
 * Grants access to Admin and CEO roles (CEO is an executive superset)
 */
const requireAdmin = [requireAuth, requireRole('ADMIN', 'CEO')];

/**
 * CEO Authorization Middleware (Ashraf Sahib - Executive Governance & Financials)
 * Strictly restricted to CEO role.
 */
const requireCEO = [requireAuth, requireRole('CEO')];

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireCEO,
};
