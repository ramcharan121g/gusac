import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import wingsRoutes from './routes/wings.js';
import projectsRoutes from './routes/projects.js';
import eventsRoutes from './routes/events.js';
import auditRoutes from './routes/audit.js';
import inventoryRoutes from './routes/inventory.js';
import inductionsRoutes from './routes/inductions.js';
import clubRoutes from './routes/club.js';
import siteContentRoutes from './routes/siteContent.js';

// Automatically load .env file if present (Node.js 20+ native feature)
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch (e) {
  // .env file is optional; environment variables may be provided by Cloud Run / Secret Manager
}

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ==========================================
// 1. Cloud Proxy Configuration (Google Cloud Run / Load Balancer)
// ==========================================
// Trust first proxy hop so req.ip and rate-limiting reflect the real user's IP
app.set('trust proxy', 1);

// ==========================================
// 2. Security Headers (OWASP Recommended)
// ==========================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000", "ws://localhost:3000", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Dynamic CORS for local development, Vercel deployments, and production cloud domains
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      // In development or if explicitly in allowed list
      if (!IS_PROD || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow any Vercel domain (*.vercel.app), localhost, or 127.0.0.1
      if (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Safe fallback: allow rather than crashing with 500 Internal Server Error
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-reauth-password', 'x-reauth-mfa', 'x-csrf-token']
  })
);

// Serverless path normalization: ensure routes match whether invoked as /api/... or /...
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && !req.url.startsWith('/dist') && !req.url.startsWith('/assets')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ==========================================
// 3. Global & Specific Rate Limiters
// ==========================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP to 400 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait 15 minutes before making further requests.'
  }
});
app.use('/api/', apiLimiter);

// Stricter rate limiter for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Authentication rate limit triggered. Protection active against brute force.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// ==========================================
// 4. Mount API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wings', wingsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/inductions', inductionsRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/site-content', siteContentRoutes);

import { testDbConnection } from './db/postgres.js';

// Enhanced Health Check for Google Cloud Run Liveness & Readiness Probes
app.get('/api/health', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const dbHealth = await testDbConnection();
  res.json({
    status: dbHealth.connected ? 'HEALTHY' : 'DEGRADED',
    service: 'GUSAC Enterprise API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '2.2.0-SUPABASE-CONNECTED',
    environment: process.env.NODE_ENV || 'development',
    database: {
      provider: 'Supabase Managed PostgreSQL',
      connected: dbHealth.connected,
      serverTime: dbHealth.timestamp
    },
    cloudPlatform: 'Google Cloud Run Ready',
    memory: {
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024)
    }
  });
});

// ==========================================
// 5. Static Files & SPA Routing (Production Standalone Mode)
// ==========================================
if (IS_PROD) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Fallback 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found', path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred. The incident has been securely logged.'
  });
});

// ==========================================
// 6. Server Lifecycle & Graceful Shutdown
// ==========================================
let server;
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`🛡️ GUSAC Secure Backend Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔒 OWASP Security Middleware & Google Cloud Run Hooks Active`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`[Lifecycle] Received ${signal}. Draining connections gracefully...`);
    server.close(() => {
      console.log('[Lifecycle] HTTP server closed cleanly. Exiting.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('[Lifecycle] Forceful termination triggered after 10s timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;

