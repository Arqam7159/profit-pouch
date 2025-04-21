import React from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container, SvgIcon, IconButton } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthContext';

const Logo = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 32, mr: 1.5 }}>
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-2 3v10M10 7h4c1.66 0 3 1.34 3 3s-1.34 3-3 3h-4"
    />
  </SvgIcon>
);

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(45deg, #020617 30%, #0F172A 90%)',
          boxShadow: '0 3px 5px 2px rgba(2, 6, 23, .4)'
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Logo sx={{ 
              color: '#E2E8F0',
              filter: 'drop-shadow(0 0 2px rgba(226, 232, 240, 0.2))',
            }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: 0.5,
                fontSize: '1.3rem',
                color: '#E2E8F0',
              }}
            >
              ProfitPouch
            </Typography>
          </Box>
          <Tabs 
            value={location.pathname} 
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontWeight: 500,
                color: '#94A3B8',
                '&.Mui-selected': {
                  color: '#E2E8F0'
                },
                '&:hover': {
                  color: '#F8FAFC'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#E2E8F0'
              }
            }}
          >
            <Tab 
              icon={<ShowChartIcon />} 
              iconPosition="start"
              label="Market" 
              value="/"
            />
            <Tab 
              icon={<AccountBalanceWalletIcon />} 
              iconPosition="start"
              label="Portfolio" 
              value="/portfolio"
            />
            <Tab 
              icon={<StarIcon />} 
              iconPosition="start"
              label="Watchlist" 
              value="/watchlist"
            />
          </Tabs>
          <IconButton 
            onClick={handleLogout}
            sx={{ 
              ml: 2,
              color: '#94A3B8',
              '&:hover': {
                color: '#E2E8F0',
                backgroundColor: 'rgba(226, 232, 240, 0.08)'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
} 