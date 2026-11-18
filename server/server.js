// server/server.js
import cluster from 'node:cluster';
import os from 'node:os';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import templateRoutes from './routes/templateRoutes.js';

dotenv.config();

const cpuCores = os.cpus();
const totalWorkers = Number(process.env.WEB_CONCURRENCY) || Math.min(cpuCores.length, 2);

// Node.js Cluster Load Balancer
if (cluster.isPrimary && process.env.ENABLE_CLUSTER === 'true') {
  console.log(`🚀 Primary Load Balancer [PID: ${process.pid}] is running.`);
  console.log(`⚡ Spawning ${totalWorkers} workers...`);

  for (let i = 0; i < totalWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.warn(`⚠️ Worker [PID: ${worker.process.pid}] died. Spawning a replacement...`);
    cluster.fork();
  });
} else {
  const app = express();
  // Render sits behind one proxy: without this every visitor shares the proxy's IP in the rate limiter
  app.set('trust proxy', 1);
  const { PORT = 5000, CLIENT_URL = 'http://localhost:5173' } = process.env;

  // Connect MongoDB
  connectDB();

  // Security & Global Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  // Rate Limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
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
      message: 'DUTechUnit / Campus Resources Hub Server is live!',
      workerPid: process.pid,
    });
  });

  // All API Routes (Without Chat)
  app.use('/api/links', linkRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/email', emailRoutes);
  app.use('/api/reviews', reviewRoutes);
  
  // ✅ ঠিক করা হয়েছে: 404 হ্যান্ডলারের উপরে বসানো হয়েছে
  app.use('/api/templates', templateRoutes);

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
    console.log(`🟢 Server [PID: ${process.pid}] running smoothly on port ${PORT}`);
  });
}