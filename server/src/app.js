import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import fileRoutes from './routes/file.routes.js';
import chartRoutes from './routes/chart.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
app.use(cors({ origin }));
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
