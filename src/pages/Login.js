import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Link as MuiLink,
  SvgIcon,
  Stack
} from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 40, color: '#E2E8F0', filter: 'drop-shadow(0 0 2px rgba(226, 232, 240, 0.2))', mr: 1.5 }}>
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-2 3v10M10 7h4c1.66 0 3 1.34 3 3s-1.34 3-3 3h-4" />
            </SvgIcon>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#E2E8F0' }}>
              ProfitPouch
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(226, 232, 240, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(226, 232, 240, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0066FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94A3B8',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#E2E8F0',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(226, 232, 240, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(226, 232, 240, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0066FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94A3B8',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#E2E8F0',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#0066FF',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#0052CC',
                },
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink
                component={Link}
                to="/signup"
                variant="body2"
                sx={{
                  color: '#94A3B8',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#E2E8F0',
                  },
                }}
              >
                Don't have an account? Sign Up
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 