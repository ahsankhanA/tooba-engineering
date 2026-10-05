const mongoose = require('mongoose');

/**
 * MongoDB Atlas Connection Configuration
 * Optimized for Render Free Tier & Serverless/Containerized Deployments:
 * - Handles cold starts via resilient serverSelectionTimeoutMS & connectTimeoutMS
 * - Connection pooling (maxPoolSize: 10, minPoolSize: 2) prevents socket saturation on M0 Free Cluster
 * - Exponential backoff retry logic to handle intermittent sleeping/network reconnects
 * - Graceful shutdown listeners to prevent orphaned socket connections
 */

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 2000;

let isConnecting = false;
let retryCount = 0;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DATABASE CRITICAL] MONGODB_URI environment variable is not defined.');
    throw new Error('MONGODB_URI_MISSING: Cannot initialize database connection.');
  }

  // Prevent concurrent multiple connection attempts during cold starts
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  const mongooseOptions = {
    maxPoolSize: 10, // Safeguard for MongoDB Atlas Free Tier (M0 has a 500 connection ceiling)
    minPoolSize: 2,  // Pre-warmed sockets to minimize latency after cold start wakeups
    serverSelectionTimeoutMS: 10000, // Wait up to 10s before timing out on cold starts
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4, // Force IPv4 to prevent DNS resolution latency on Render
    autoIndex: process.env.NODE_ENV !== 'production', // Build indexes only in development to prevent CPU spikes
  };

  while (retryCount < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(uri, mongooseOptions);
      console.log(`[DATABASE CONNECTED] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
      retryCount = 0;
      isConnecting = false;
      return conn;
    } catch (error) {
      retryCount++;
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount - 1);
      console.error(
        `[DATABASE ERROR] Connection attempt ${retryCount}/${MAX_RETRIES} failed: ${error.message}. Retrying in ${delay}ms...`
      );

      if (retryCount >= MAX_RETRIES) {
        isConnecting = false;
        console.error('[DATABASE FATAL] Maximum connection retry limit exceeded. Halting process.');
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Event Listeners for Ongoing Connection Health
mongoose.connection.on('disconnected', () => {
  console.warn('[DATABASE WARNING] Lost MongoDB Atlas connection. Driver will attempt auto-reconnect.');
});

mongoose.connection.on('error', (err) => {
  console.error('[DATABASE ERROR] Persistent socket error:', err.message);
});

// Process signal handlers for graceful connection termination
const handleGracefulShutdown = async (signal) => {
  console.log(`[PROCESS] Received ${signal}. Closing MongoDB connection cleanly...`);
  try {
    await mongoose.connection.close(false);
    console.log('[DATABASE] MongoDB connection closed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[DATABASE] Error during disconnection:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

module.exports = connectDB;
