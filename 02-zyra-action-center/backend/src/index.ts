import './config/dotenv'; // Load environment variables early
import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import routes from './routes';
import { requestLogger, errorHandler, notFoundHandler } from './middleware/index';

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Global Middleware ──────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true, // 🔥 REQUIRED
  })
);
app.use(express.json());
app.use(requestLogger);
app.use(morgan('dev')); // HTTP request logging (dev only)

// ── Health Check ───────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────
app.use('/api', routes);

// ── Error Handling ─────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Boot ───────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Zyra backend running on http://localhost:${PORT}`);
  });
}

export default app;
