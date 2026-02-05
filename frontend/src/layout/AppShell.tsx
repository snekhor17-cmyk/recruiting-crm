import { ReactNode } from 'react';
import {
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

export type PageKey =
  | 'dashboard'
  | 'candidates'
  | 'vacancies'
  | 'pipeline'
  | 'settings';

type AppShellProps = {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  onLogout: () => void;
  children: ReactNode;
};

const menuItems: MenuProps['items'] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Дашборд' },
  { key: 'candidates', icon: <TeamOutlined />, label: 'Кандидаты' },
  { key: 'vacancies', icon: <UsergroupAddOutlined />, label: 'Вакансии' },
  { key: 'pipeline', icon: <UnorderedListOutlined />, label: 'Воронка' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Настройки' },
];

export function AppShell({
  currentPage,
  onNavigate,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            color: 'white',
            padding: '16px',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          CRM для рекрутинга
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage]}
          items={menuItems}
          onClick={(event) => onNavigate(event.key as PageKey)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography.Title level={4} style={{ margin: '16px 0' }}>
            CRM для рекрутинга
          </Typography.Title>
          <Space>
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              Выйти
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
