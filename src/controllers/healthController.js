import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';

const STATES = ['відключено', 'підключено', 'підключення...', 'відключення...'];

/** GET /health — перевіряє з'єднання з MongoDB (команда ping). 200 — база відповідає, 503 — ні. */
export const health = asyncHandler(async (req, res) => {
  const state = mongoose.connection.readyState;

  if (state !== 1) {
    return res.status(503).send(`Стан MongoDB: ${STATES[state] ?? 'невідомо'}`);
  }

  try {
    await mongoose.connection.db.command({ ping: 1 });
  } catch {
    return res.status(503).send('MongoDB не відповідає на ping.');
  }

  res.send(`OK\nMongoDB: ${STATES[state]}\nБаза даних: ${mongoose.connection.name}`);
});
