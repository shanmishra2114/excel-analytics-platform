import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Named import
import { connectDB } from './config/db.js';

import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import excelRoutes from './routes/file.routes.js'; // file upload routes

// Named import for error handler
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', excelRoutes);

// Error handler
app.use(errorHandler);

// ✅ Connect DB and start server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
