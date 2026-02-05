const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type HealthCheckResult = {
  ok: boolean;
  message: string;
};

export async function pingApiHealth(): Promise<HealthCheckResult> {
  const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
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
