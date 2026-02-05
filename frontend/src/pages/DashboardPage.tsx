import { useState } from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import { pingApiHealth } from '../lib/api';

type PingState =
  | { status: 'idle' }
  | { status: 'success'; summary: string; details: string }
  | { status: 'error'; summary: string; details: string };

export function DashboardPage() {
  const [pingState, setPingState] = useState<PingState>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const onPingApi = async () => {
    setIsLoading(true);

    try {
      const result = await pingApiHealth();
      setPingState({
        status: 'success',
        summary: 'Сервер доступен',
        details: result.message || '{}',
      });
    } catch (error) {
      setPingState({
        status: 'error',
        summary: 'Ошибка подключения к серверу',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={2}>Дашборд</Typography.Title>
      <Typography.Text type="secondary">Эта страница проверяет доступность сервера.</Typography.Text>
      <div>
        <Button type="primary" loading={isLoading} onClick={onPingApi}>
          Проверить сервер
        </Button>
      </div>
      {pingState.status === 'success' && (
        <Alert
          type="success"
          message={pingState.summary}
          description={<Typography.Text code>{pingState.details}</Typography.Text>}
          showIcon
        />
      )}
      {pingState.status === 'error' && (
        <Alert
          type="error"
          message={pingState.summary}
          description={<Typography.Text code>{pingState.details}</Typography.Text>}
          showIcon
        />
      )}
    </Space>
  );
}
