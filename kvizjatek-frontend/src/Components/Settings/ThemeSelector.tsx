import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy'; // Grid v5 stílusú API
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useAppTheme, type AppTheme } from '../../lib/useTheme';

type ThemeMeta = {
  id: AppTheme;
  label: string;
  bg1: string;
  bg2: string;
  accent1: string;
  accent2: string;
  text: string;
};

const THEMES: ThemeMeta[] = [
  { id: 'purple', label: 'Lila', bg1: '#0f0a1f', bg2: '#1a1233', accent1: '#b27cff', accent2: '#7a4df3', text: '#f3eefc' },
  { id: 'green', label: 'Zöld', bg1: '#061a15', bg2: '#0d2b24', accent1: '#38e4a8', accent2: '#18b37f', text: '#eafff8' },
  { id: 'blue', label: 'Kék', bg1: '#0a1330', bg2: '#0e1e53', accent1: '#7ab3ff', accent2: '#3a78ff', text: '#eef5ff' },
  { id: 'red', label: 'Piros', bg1: '#1a0a0f', bg2: '#2c0f1a', accent1: '#ff7aa6', accent2: '#f34d7a', text: '#fff0f4' },
  { id: 'teal', label: 'Tengerzöld', bg1: '#071a1f', bg2: '#0c2b33', accent1: '#6fe7f0', accent2: '#2cc4cf', text: '#e6fbff' },
  { id: 'amber', label: 'Borostyán', bg1: '#1a1406', bg2: '#2c210a', accent1: '#ffcf6f', accent2: '#f39b2c', text: '#fff8ea' },
];

const PreviewCard: React.FC<{
  meta: ThemeMeta;
  selected: boolean;
  onSelect: () => void;
}> = ({ meta, selected, onSelect }) => {
  return (
    <Paper
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="glass neon-border"
      elevation={0}
      sx={{
        p: 2,
        cursor: 'pointer',
        position: 'relative',
        outline: selected ? `2px solid ${meta.accent1}` : 'none',
        transition: 'transform 120ms ease, outline-color 120ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      {/* Mini preview – 3 kis “kártya” egy sorban */}
      <Box
        sx={{
          height: 96,
          borderRadius: 1.5,
          p: 1.5,
          background: `radial-gradient(60% 60% at 50% 40%, ${meta.bg2}, ${meta.bg1})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: '100%',
            borderRadius: 1.25,
            background: `${meta.accent1}22`,
            border: `1px solid ${meta.accent1}55`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: '100%',
            borderRadius: 1.25,
            background: `${meta.accent2}22`,
            border: `1px solid ${meta.accent2}55`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: '100%',
            borderRadius: 1.25,
            background: `${meta.text}11`,
            border: `1px solid ${meta.text}44`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'var(--text)' }}>
          {meta.label}
        </Typography>
        {selected && (
          <CheckCircleIcon
            fontSize="small"
            sx={{ color: meta.accent1 }}
            aria-label="Kiválasztva"
          />
        )}
      </Box>
    </Paper>
  );
};

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useAppTheme();
  const navigate = useNavigate();

  return (
    <Stack sx={{ mt: 4 }} alignItems="center">
      <Box sx={{ width: '100%', maxWidth: 960, px: 2 }}>
        {/* Vissza gomb */}
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

        {/* Fejléc doboz */}
        <Paper className="glass neon-border" elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Beállítások
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
            Válassz színsémát. A választásod elmentjük a böngészőbe.
          </Typography>
        </Paper>

        {/* GridLegacy – 3 oszlop md-től, 2 oszlop sm-en, 1 oszlop xs-en */}
        <Grid container spacing={2}>
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
      </Box>
    </Stack>
  );
};

export default SettingsPage;