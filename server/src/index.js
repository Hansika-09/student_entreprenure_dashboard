import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';
import revenueRoutes from './routes/revenue.js';
import academicsRoutes from './routes/academics.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/revenue', revenueRoutes);
app.use('/api/academics', academicsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: process.env.DB_MODE || 'sqlite' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database mode: ${process.env.DB_MODE || 'sqlite'}`);
  });
}

start().catch(console.error);
