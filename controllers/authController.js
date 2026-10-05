const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a signed JWT with strict claims
 */
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    secret,
    {
      expiresIn,
      algorithm: 'HS256',
    }
  );
};

/**
 * Configure secure cookie parameters based on environment
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // Prevents client-side JavaScript access (Anti-XSS token theft)
    secure: isProduction, // Transmitted only over HTTPS in production
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    path: '/',
  };
};

/**
 * POST /api/auth/login
 * Public endpoint protected by strict IP rate limiter
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Strict Input Sanitization & Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Both email and password are required fields.',
          statusCode: 400,
        },
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 2. Fetch User along with passwordHash explicitly
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      // Timing-safe response: Prevent account enumeration attacks
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password credentials.',
          statusCode: 401,
        },
      });
    }

    // 3. Check Account Lockout State
    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const waitMinutes = Math.ceil((new Date(user.lockUntil).getTime() - Date.now()) / (60 * 1000));
      return res.status(403).json({
        success: false,
        error: {
          message: `Account is temporarily locked due to 5 consecutive failed login attempts. Please try again in ${waitMinutes} minute(s).`,
          statusCode: 403,
        },
      });
    }

    // 4. Verify Password Hash using bcrypt
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.handleFailedLogin();
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password credentials.',
          statusCode: 401,
        },
      });
    }

    // 5. Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Your account has been deactivated. Please contact the CEO office.',
          statusCode: 403,
        },
      });
    }

    // 6. Reset failed login attempts on successful verification
    await user.handleSuccessfulLogin();

    // 7. Generate JWT & Set Secure HttpOnly Cookie
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, getCookieOptions());

    // 8. Return Sanitized User Profile (No password hash, no secret tokens)
    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clears the HttpOnly session cookie
 */
const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. Session invalidated.',
  });
};

/**
 * GET /api/auth/me
 * Retrieves authenticated user session profile
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  login,
  logout,
  getMe,
};
