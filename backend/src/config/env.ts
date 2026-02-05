import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 3000;
const DEFAULT_CORS_ORIGIN = 'http://localhost:5173';

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') {
    return DEFAULT_PORT;
  }

  const port = Number.parseInt(value, 10);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(
      `Invalid PORT value: "${value}". PORT must be a positive integer.`,
    );
  }

  return port;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: parsePort(process.env.PORT),
  corsOrigin: process.env.CORS_ORIGIN?.trim() || DEFAULT_CORS_ORIGIN,
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '7d',
  isDevMode: (process.env.NODE_ENV || 'development') !== 'production',
};
