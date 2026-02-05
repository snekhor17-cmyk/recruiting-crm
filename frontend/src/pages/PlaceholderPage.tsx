import { Space, Typography } from 'antd';

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Space direction="vertical" size="small">
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Text type="secondary">
        Эта страница находится в разработке.
      </Typography.Text>
    </Space>
  );
}
