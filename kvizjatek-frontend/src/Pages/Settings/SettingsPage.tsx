import React from 'react';
import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../../lib/useTheme';
import {
  PreviewCard,
  THEMES,
} from '../../Components/Settings/ThemeSelector';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useAppTheme();
  const navigate = useNavigate();

  return (
    <Stack alignItems="center" sx={{ mt: 4, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 960, px: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          sx={{ mb: 2 }}
        >
          Vissza
        </Button>

        <Paper className="glass neon-border" elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Beállítások
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
            Válassz színsémát. A választásod elmentjük a böngészőbe.
          </Typography>
        </Paper>

        {/* The Grid remains unchanged, but it now renders the imported PreviewCard */}
        <Grid container spacing={2} sx={{ overflow: 'visible' }}>
          {THEMES.map((t) => (
            <Grid key={t.id} item xs={12} sm={6} md={4}>
              <PreviewCard
                meta={t}
                selected={theme === t.id}
                onSelect={() => setTheme(t.id)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Adjunk egy alsó térközt, hogy biztos látszódjon a 2. sor */}
        <Box sx={{ height: 24 }} />
      </Box>
    </Stack>
  );
};

export default SettingsPage;
