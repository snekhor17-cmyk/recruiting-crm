import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';

import { loginByEmailAndPassword } from '../lib/api';
import { setToken } from '../lib/auth';

type LoginPageProps = {
  onLoginSuccess: () => void;
};

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginByEmailAndPassword(
        values.email,
        values.password,
      );
      setToken(result.token);
      onLoginSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Не удалось выполнить вход',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Вход в CRM
          </Typography.Title>

          {errorMessage && (
            <Alert type="error" message={errorMessage} showIcon />
          )}

          <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Введите email' }]}
            >
              <Input placeholder="admin@local" autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Войти
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
