import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import VolumeLeaders from './components/VolumeLeaders';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { TradesProvider } from './context/TradesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Watchlist from './pages/Watchlist';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E2E8F0',
      light: '#F8FAFC',
      dark: '#CBD5E1',
    },
    secondary: {
      main: '#94A3B8',
      light: '#CBD5E1',
      dark: '#64748B',
    },
    background: {
      default: '#020617',
      paper: '#0F172A',
    },
    success: {
      main: '#00e676',
      light: '#66ffa6',
      dark: '#00b248',
    },
    error: {
      main: '#ff1744',
      light: '#ff616f',
      dark: '#c4001d',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    allVariants: {
      color: '#E2E8F0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F172A',
          '&.MuiCard-root': {
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(226, 232, 240, 0.08)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#E2E8F0',
          '&::placeholder': {
            color: '#94A3B8',
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(226, 232, 240, 0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(226, 232, 240, 0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8F0',
          },
        },
      },
    },
  },
});

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // Or a loading spinner
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <TradesProvider>
            <WatchlistProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={
                  <RequireAuth>
                    <Layout />
                  </RequireAuth>
                }>
                  <Route index element={<VolumeLeaders />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                </Route>
              </Routes>
            </WatchlistProvider>
          </TradesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App; 