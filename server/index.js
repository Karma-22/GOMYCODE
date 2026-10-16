require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Production Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Serve Static Client Assets with Cache-Control
app.use(express.static(path.join(__dirname, '..', 'client', 'dist'), {
  maxAge: '1d',
  etag: true
}));

// --- Health Check & Uptime Monitoring Endpoints ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong', time: Date.now() });
});

app.get('/api/info', (req, res) => {
  res.status(200).json({
    app: 'GoMyCode Production Deployment Hub',
    author: 'Darius Ange (Karma-22)',
    platform: process.platform,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage()
  });
});

// Fallback to client SPA index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Graceful Shutdown
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`🚀 Production server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`🩺 Health check accessible at http://localhost:${PORT}/health`);
  });

  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log('⚡ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
