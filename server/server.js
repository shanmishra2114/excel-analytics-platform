// server/server.js
import http from 'http';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import app from './index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
