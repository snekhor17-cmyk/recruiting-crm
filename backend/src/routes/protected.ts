import { Router } from 'express';

import { authRequired } from '../middleware/authRequired.js';

export const protectedRouter = Router();

protectedRouter.get('/protected/ping', authRequired, (req, res) => {
  res.json({ ok: true, message: `Привет, ${req.user?.name}!` });
});
