import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
} from '@mui/material';
import CenterStage from '../../Components/Layout/CenterStage';
import GlassBackground from '../../Components/Layout/GlassBackground';
import LoginIcon from '@mui/icons-material/Login';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../lib/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handles the form submission to the backend login endpoint.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the login API endpoint defined in the Flask backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The backend expects 'email' and 'password' in the JSON body
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message provided by the backend API
        throw new Error(data.error || 'Ismeretlen hiba történt');
      }

      login(data.user, data.access_token, data.refresh_token);

      // TODO: Store the tokens (data.access_token) and user (data.user)
      // in a global Auth Context or state management library.
      // E.g., auth.login(data.access_token, data.user);

      // Navigate to the home page after successful login
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Csatlakozási hiba. Kérjük, próbálja újra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Use the CenterStage component for consistent page centering
    <CenterStage>
      {/* Use the GlassBackground for the "glassmorphism" effect */}
      <GlassBackground className="menu-surface">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 420, // Consistent width for auth forms
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack spacing={3} sx={{ width: '100%' }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              textAlign="center"
            >
              Bejelentkezés
            </Typography>

            <TextField
              required
              fullWidth
              type="email"
              label="E-mail cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              type="password"
              label="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%', mt: 1 }}
              >
                {error}
              </Alert>
            )}

            <Box sx={{ position: 'relative', width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                // Styling will be picked up from the MuiTheme
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Bejelentkezés
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: 'text.secondary', pt: 1 }}
            >
              Nincs még fiókod?{' '}
              <Link
                component={RouterLink}
                to="/register" // Route to RegisterPage
                fontWeight={700}
                color="primary"
                underline="hover"
              >
                Regisztrálj itt!
              </Link>
            </Typography>
          </Stack>
        </Box>
      </GlassBackground>
    </CenterStage>
  );
};

export default LoginPage;
