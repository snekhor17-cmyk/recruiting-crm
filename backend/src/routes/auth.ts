import { Router } from 'express';

import { authRequired } from '../middleware/authRequired.js';
import { authenticateByEmailAndPassword } from '../services/authService.js';

export const authRouter = Router();

const INVALID_CREDENTIALS_MESSAGE = 'Неверный email или пароль';

function parseCredentials(body: unknown): { email: string; password: string } | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const { email, password } = body as { email?: unknown; password?: unknown };

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim() === '' ||
    password.trim() === ''
  ) {
    return null;
  }

  return { email: email.trim(), password };
}

authRouter.post('/auth/login', async (req, res) => {
  const credentials = parseCredentials(req.body);

  if (!credentials) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  const authResult = await authenticateByEmailAndPassword(
    credentials.email,
    credentials.password,
  );

  if (!authResult) {
    return res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
  }

  return res.json(authResult);
});

authRouter.get('/auth/me', authRequired, (req, res) => {
  return res.json(req.user);
});
