import { randomUUID } from 'node:crypto';

import { env } from '../config/env.js';
import {
  findUserByEmail,
  findUserById,
  upsertUser,
} from '../data/userStore.js';
import type { AuthTokenPayload, PublicUser, User } from '../types/auth.js';
import { signJwt, verifyJwt } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const ADMIN_EMAIL = 'admin@local';
const ADMIN_PASSWORD = 'admin12345';

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function ensureAdminUserSeeded(): Promise<void> {
  if (!env.isDevMode || findUserByEmail(ADMIN_EMAIL)) {
    return;
  }

  const now = new Date().toISOString();

  upsertUser({
    id: randomUUID(),
    email: ADMIN_EMAIL,
    name: 'Локальный администратор',
    role: 'admin',
    passwordHash: hashPassword(ADMIN_PASSWORD),
    createdAt: now,
    updatedAt: now,
  });

  console.log(`Dev admin user created with email: ${ADMIN_EMAIL}`);
}

export async function authenticateByEmailAndPassword(
  email: string,
  password: string,
): Promise<{ token: string; user: PublicUser } | null> {
  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  const payload: AuthTokenPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = signJwt(payload, env.jwtSecret, env.jwtExpiresIn);

  return {
    token,
    user: toPublicUser(user),
  };
}

export function findPublicUserById(userId: string): PublicUser | null {
  const user = findUserById(userId);
  return user ? toPublicUser(user) : null;
}

export function verifyToken(token: string): AuthTokenPayload {
  const payload = verifyJwt(token, env.jwtSecret);

  if (typeof payload.userId !== 'string') {
    throw new Error('Token payload is invalid');
  }

  if (
    payload.role !== 'admin' &&
    payload.role !== 'hr' &&
    payload.role !== 'manager'
  ) {
    throw new Error('Token payload role is invalid');
  }

  return {
    userId: payload.userId,
    role: payload.role,
  };
}
