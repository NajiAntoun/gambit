import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Clerk JWT verification — must come before protected routes.
// Requires CLERK_SECRET_KEY env var.
app.use(clerkMiddleware());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', aiRouter);

app.listen(PORT, () => {
  console.log(`Gambit server running on port ${PORT}`);
});
