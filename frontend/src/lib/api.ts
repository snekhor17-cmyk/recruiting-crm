import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type HealthCheckResult = {
  ok: boolean;
  message: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'manager';
};

function makeHeaders(): HeadersInit {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function pingApiHealth(): Promise<HealthCheckResult> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: makeHeaders(),
  });
  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Status ${response.status}: ${bodyText || 'Неизвестная ошибка'}`,
    );
  }

  return {
    ok: true,
    message: bodyText,
  };
}

export async function loginByEmailAndPassword(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(body?.message || 'Ошибка входа');
  }

  return body as { token: string; user: AuthUser };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: makeHeaders(),
  });

  const body = (await response.json().catch(() => null)) as
    | { message?: string }
    | AuthUser
    | null;

  if (!response.ok) {
    throw new Error(
      (body as { message?: string } | null)?.message ||
        'Не удалось получить пользователя',
    );
  }

  return body as AuthUser;
}
