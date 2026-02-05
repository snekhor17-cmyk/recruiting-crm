import type { NextFunction, Request, Response } from 'express';

import { findPublicUserById, verifyToken } from '../services/authService.js';

const UNAUTHORIZED_MESSAGE = 'Необходима авторизация';

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }

  try {
    const payload = verifyToken(token);
    const user = findPublicUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }
}
