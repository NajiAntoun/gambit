import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { aiRouter } from './routes/ai';
import { progressRouter } from './routes/progress';
import { initDb } from './lib/db';

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
app.use(clerkMiddleware());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', aiRouter);
app.use('/api/progress', progressRouter);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Gambit server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  });
