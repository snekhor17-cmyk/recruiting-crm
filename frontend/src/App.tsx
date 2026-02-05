import { useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import TimelineIcon from '@mui/icons-material/Timeline';
import SettingsIcon from '@mui/icons-material/Settings';

type PageKey = 'Dashboard' | 'Candidates' | 'Vacancies' | 'Pipeline' | 'Settings';

type PingState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const drawerWidth = 240;

const navItems: Array<{ label: PageKey; icon: JSX.Element }> = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Candidates', icon: <GroupIcon /> },
  { label: 'Vacancies', icon: <WorkIcon /> },
  { label: 'Pipeline', icon: <TimelineIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> },
];

function DashboardPage() {
  const [pingState, setPingState] = useState<PingState>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const onPingApi = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/health`, { method: 'GET' });
      const bodyText = await response.text();

      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${bodyText || 'Unknown error'}`);
      }

      setPingState({
        status: 'success',
        message: bodyText || 'API responded with success status.',
      });
    } catch (error) {
      setPingState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to ping API.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography color="text.secondary">Use this page to verify backend availability.</Typography>
      <Box>
        <Button variant="contained" onClick={onPingApi} disabled={isLoading}>
          {isLoading ? 'Pinging…' : 'Ping API'}
        </Button>
      </Box>
      {pingState.status === 'success' && <Alert severity="success">{pingState.message}</Alert>}
      {pingState.status === 'error' && <Alert severity="error">{pingState.message}</Alert>}
    </Box>
  );
}

function PlaceholderPage({ title }: { title: Exclude<PageKey, 'Dashboard'> }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h4">{title}</Typography>
      <Typography color="text.secondary">This page is a placeholder for future implementation.</Typography>
    </Box>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Dashboard');

  const content = useMemo(() => {
    if (currentPage === 'Dashboard') {
      return <DashboardPage />;
    }

    return <PlaceholderPage title={currentPage} />;
  }, [currentPage]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Recruiting CRM
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={currentPage === item.label}
              onClick={() => setCurrentPage(item.label)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

export default App;
