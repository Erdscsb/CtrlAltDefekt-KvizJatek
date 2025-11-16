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
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the form submission to the backend register endpoint.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Client-side validation
    if (password !== confirmPassword) {
      setError('A két jelszó nem egyezik.');
      setLoading(false);
      return;
    }

    try {
      // 2. Call the API endpoint
      //
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The backend expects 'email', 'username', and 'password'
        //
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the backend (e.g., "Ez az e-mail cím már foglalt")
        //
        throw new Error(data.error || 'Ismeretlen hiba történt');
      }

      // 3. Handle Success
      setSuccess(data.message || 'Sikeres regisztráció!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login'); //
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Csatlakozási hiba. Kérjük, próbálja újra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterStage>
      <GlassBackground className="menu-surface">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 420, // Consistent width with LoginPage
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
              Regisztráció
            </Typography>

            <TextField
              required
              fullWidth
              label="Felhasználónév"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || !!success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              type="email"
              label="E-mail cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!success}
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
              disabled={loading || !!success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              type="password"
              label="Jelszó megerősítése"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!success}
              error={!!error && error.includes('nem egyezik')}
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

            {success && (
              <Alert
                severity="success"
                variant="filled"
                sx={{ width: '100%', mt: 1 }}
              >
                {success} Átirányítás a bejelentkezéshez...
              </Alert>
            )}

            <Box sx={{ position: 'relative', width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !!success}
                startIcon={<AppRegistrationIcon />}
                // Styling consistent with LoginPage button
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Regisztráció
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
              Már van fiókod?{' '}
              <Link
                component={RouterLink}
                to="/login" //
                fontWeight={700}
                color="primary"
                underline="hover"
              >
                Jelentkezz be!
              </Link>
            </Typography>
          </Stack>
        </Box>
      </GlassBackground>
    </CenterStage>
  );
};

export default RegisterPage;
