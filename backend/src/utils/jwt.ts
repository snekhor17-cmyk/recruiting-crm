import { createHmac } from 'node:crypto';

function toBase64Url(value: string): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(value: string): string {
  const padded = value.padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    '=',
  );
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function parseExpiresInSeconds(expiresIn: string): number {
  const raw = expiresIn.trim();

  if (/^\d+$/.test(raw)) {
    return Number.parseInt(raw, 10);
  }

  const match = raw.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error(`Unsupported JWT_EXPIRES_IN format: ${expiresIn}`);
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return amount * multipliers[unit];
}

export function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string,
): string {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    iat: nowInSeconds,
    exp: nowInSeconds + parseExpiresInSeconds(expiresIn),
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(body));
  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(
  token: string,
  secret: string,
): Record<string, unknown> {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as Record<
    string,
    unknown
  >;
  const exp = typeof payload.exp === 'number' ? payload.exp : null;

  if (!exp || exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}
