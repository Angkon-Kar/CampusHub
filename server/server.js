// server/server.js
import cluster from 'node:cluster';
import os from 'node:os';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminTagRoutes from './routes/adminTagRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import templateRoutes from './routes/templateRoutes.js';

dotenv.config();

const numCPUs = os.cpus().length;
const isProduction = process.env.NODE_ENV === 'production';

// Cluster Mode: Production-e multiple CPU cores use kore high concurrency handle korbe
if (cluster.isPrimary && isProduction && process.env.DISABLE_CLUSTER !== 'true') {
  console.log(`🚀 Primary Process ${process.pid} is running. Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️ Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();
  // Render sits behind one proxy: without this every visitor shares the proxy's IP in the rate limiter
  app.set('trust proxy', 1);
  const { PORT = 5000, CLIENT_URL = 'http://localhost:5173' } = process.env;

  // Connect MongoDB
  connectDB();

  // Security & Performance Middlewares
  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Rate Limiting (Prevents DDoS & brute force)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use('/api', apiLimiter);

  // Stricter limits on the endpoints that can be abused to look up accounts
  const strictLimiter = (limit) =>
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many attempts, please try again later.' },
    });
  app.use('/api/auth/resolve-identifier', strictLimiter(15));
  app.use('/api/auth/check-username', strictLimiter(120));
  app.use('/api/email', strictLimiter(15));
  app.use('/api/posts/:id/view', strictLimiter(120));

  // Health Check Route
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'CampusHub API is running smoothly!',
      workerPid: process.pid,
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/links', linkRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/admin/tags', adminTagRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/tags', tagRoutes);
  app.use('/api/push', pushRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/email', emailRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/templates', templateRoutes);

  // /sitemap.xml and /robots.txt (Vercel rewrites these two paths to this server)
  app.use(seoRoutes);

  // Unknown API routes (404 Handler)
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
  });

  // Global Error Handler (hides internal details in production)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    if (statusCode >= 500) console.error(err);
    const message =
      statusCode >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error';
    res.status(statusCode).json({ success: false, message });
  });

  app.listen(PORT, () => {
    console.log(`⚡ Worker ${process.pid} listening on port ${PORT}`);
  });
}