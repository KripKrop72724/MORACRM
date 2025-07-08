import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Fade,
  CircularProgress,
} from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const success = await signup(email, password, confirmPassword);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Fade in timeout={600}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <AccountBalanceIcon
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Join AlaaMohra CRM today
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                disabled={isLoading}
                helperText="Minimum 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="outlined"
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  position: 'relative',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#000000',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default Signup;