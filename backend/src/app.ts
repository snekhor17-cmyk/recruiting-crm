import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { healthRouter } from './routes/health.js';
import { protectedRouter } from './routes/protected.js';

export const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use(healthRouter);
app.use(authRouter);
app.use(protectedRouter);
