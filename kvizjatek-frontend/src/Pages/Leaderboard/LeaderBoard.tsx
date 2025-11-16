import React from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

type Row = {
  rank: number;
  name: string;
  points: number;
  country?: string;
};

const MOCK: Row[] = [
  { rank: 1, name: 'Aurora', points: 9820, country: 'HU' },
  { rank: 2, name: 'NeonKnight', points: 9410, country: 'DE' },
  { rank: 3, name: 'QuizMaster', points: 9105, country: 'PL' },
  { rank: 4, name: 'ByteFox', points: 8800, country: 'FR' },
  { rank: 5, name: 'Violet', points: 8610, country: 'ES' },
  { rank: 6, name: 'StormCat', points: 8540, country: 'SE' },
  { rank: 7, name: 'MindSpark', points: 8420, country: 'GB' },
  { rank: 8, name: 'Delta', points: 8315, country: 'US' },
  { rank: 9, name: 'Nova', points: 8290, country: 'IT' },
  { rank: 10, name: 'Krypton', points: 8200, country: 'RO' },
];

const medalColor = (rank: number) => {
  if (rank === 1) return '#ffd54f'; // arany
  if (rank === 2) return '#cfd8dc'; // ezüst
  if (rank === 3) return '#ffb74d'; // bronz
  return 'transparent';
};

const RowItem: React.FC<{ row: Row }> = ({ row }) => {
  const top3 = row.rank <= 3;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 120px',
        gap: 12,
        alignItems: 'center',
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        background: top3 ? 'rgba(255,255,255,0.03)' : 'transparent',
        position: 'relative',
        ...(top3 && {
          boxShadow: `0 0 0 1px ${medalColor(row.rank)}22, 0 8px 24px rgba(0,0,0,0.25)`,
        }),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {row.rank <= 3 ? (
          <EmojiEventsIcon
            sx={{
              color: medalColor(row.rank),
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
            }}
          />
        ) : (
          <MilitaryTechIcon sx={{ color: 'var(--muted)' }} />
        )}
        <Typography
          component="span"
          sx={{ width: 24, textAlign: 'right', color: 'var(--text)' }}
        >
          {row.rank}
        </Typography>
      </Stack>

      <Stack spacing={0}>
        <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
        <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
          {row.country ?? '—'}
        </Typography>
      </Stack>

      <Typography
        sx={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)' }}
      >
        {row.points.toLocaleString('hu-HU')} pt
      </Typography>
    </Box>
  );
};

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');

  const rows = React.useMemo(() => {
    const filtered = q.trim()
      ? MOCK.filter((r) =>
          r.name.toLowerCase().includes(q.trim().toLowerCase())
        )
      : MOCK;
    return filtered;
  }, [q]);

  return (
    <Stack alignItems="center" sx={{ mt: 4, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 1040, px: 2 }}>
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

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              className="glass neon-border"
              elevation={0}
              sx={{ p: 3 }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>
                    Ranglétra
                  </Typography>
                </Stack>

                <TextField
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  size="small"
                  placeholder="Keresés játékos névre…"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton edge="start" tabIndex={-1}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: '100%', sm: 320 } }}
                />
              </Stack>

              {/* Lista kártya a glass felületen belül */}
              <Box
                className="menu-panel"
                sx={{
                  p: 2,
                  maxHeight: 520,
                  overflow: 'auto',
                }}
              >
                <Stack spacing={1.2}>
                  {rows.map((r) => (
                    <RowItem key={r.rank} row={r} />
                  ))}
                </Stack>
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2 }}
              >
                <Typography variant="caption" className="subtle">
                  Összes játékos: {MOCK.length}
                </Typography>
                <Typography variant="caption" className="subtle">
                  Demo adatok – később API-ból
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default LeaderboardPage;