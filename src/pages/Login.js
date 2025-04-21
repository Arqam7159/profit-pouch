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
  Link as MuiLink
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
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ 
              mb: 3,
              textAlign: 'center',
              fontWeight: 600,
              color: '#E2E8F0'
            }}
          >
            Welcome Back
          </Typography>

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