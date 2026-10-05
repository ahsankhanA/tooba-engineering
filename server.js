require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { parse } = require('url');
const next = require('next');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const ceoRoutes = require('./routes/ceoRoutes');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

// Security: Disable express fingerprint
app.disable('x-powered-by');

// Body Parsing & Cookie Middleware
app.use(express.json({ limit: '100kb' })); // Mitigate oversized payload Denial of Service
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());

// Controlled CORS Policy (Zero-Trust Origin Binding)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., server-to-server or curl in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS security policy.'));
    },
    credentials: true, // Crucial for HttpOnly Cookie transmission
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health Check Endpoint (Render Free Tier Cold-Start Monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Application Backend Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/ceo', ceoRoutes);

// Catch-all 404 specifically for undefined /api/* endpoints
app.all(/^\/api(\/.*)?$/, (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}. API endpoint does not exist.`,
      statusCode: 404,
    },
  });
});

// Centralized API Error Handling Middleware
app.use(errorHandler);

// Next.js Frontend Request Handler for all other pages & static assets
app.all(/.*/, (req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Connect to database before accepting incoming connections
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('[SERVER WARNING] MONGODB_URI is not set. Database not initialized.');
    }

    // 2. Prepare Next.js frontend
    console.log('[TOOBA ERP] Preparing Next.js App Router engine...');
    await nextApp.prepare();

    // 3. Start listening
    app.listen(PORT, () => {
      console.log(`[TOOBA SECURITY SYSTEM] Production Full-Stack Server active on port ${PORT} in ${process.env.NODE_ENV || 'production'} mode.`);
    });
  } catch (error) {
    console.error('[SERVER CRITICAL] Failed to bootstrap server:', error.message);
    process.exit(1);
  }
};

// Start server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = app;
