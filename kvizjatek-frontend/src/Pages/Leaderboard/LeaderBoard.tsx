import React from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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
  { rank: 11, name: 'Echo', points: 8120, country: 'NL' },
  { rank: 12, name: 'Quasar', points: 8065, country: 'AT' },
  { rank: 13, name: 'Photon', points: 7990, country: 'CZ' },
  { rank: 14, name: 'Hyperion', points: 7925, country: 'CH' },
  { rank: 15, name: 'Lambda', points: 7880, country: 'SK' },
  { rank: 16, name: 'Raven', points: 7810, country: 'NO' },
  { rank: 17, name: 'Astra', points: 7750, country: 'FI' },
  { rank: 18, name: 'Zenith', points: 7680, country: 'DK' },
  { rank: 19, name: 'Nyx', points: 7625, country: 'BE' },
  { rank: 20, name: 'Orion', points: 7590, country: 'PT' },
];

const CATEGORIES = [
  { value: 'hu-history', label: 'Magyarország történelme' },
  { value: 'world-history', label: 'Világtörténelem' },
  { value: 'science', label: 'Tudomány' },
  { value: 'geography', label: 'Földrajz' },
  { value: 'literature', label: 'Irodalom' },
  { value: 'sports', label: 'Sport' },
];

const medalColor = (rank: number) => {
  if (rank === 1) return '#ffd54f';
  if (rank === 2) return '#cfd8dc';
  if (rank === 3) return '#ffb74d';
  return 'transparent';
};

const RowItem: React.FC<{ row: Row }> = ({ row }) => {
  const top3 = row.rank <= 3;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '52px 1fr auto', sm: '56px 1fr 120px' },
        gap: { xs: 2, sm: 3 },
        alignItems: 'center',
        padding: { xs: '12px', sm: '16px' },
        borderRadius: 3, // Matches global radius-md
        
        borderTop: '1px solid var(--glass-border-light)',
        borderBottom: '1px solid var(--glass-border-dark)',
        borderLeft: '1px solid transparent',
        borderRight: '1px solid transparent',
   
        background: top3 
          ? 'linear-gradient(90deg, var(--accent-glow) 0%, transparent 100%)' 
          : 'rgba(255,255,255,0.02)',
          
        position: 'relative',
        transition: 'transform 0.2s ease, background 0.2s ease',
        
        '&:hover': {
           background: 'rgba(255,255,255,0.05)',
           transform: 'scale(1.01)'
        },

        ...(top3 && {
          boxShadow: `0 4px 20px -5px var(--accent-glow)`,
          borderColor: 'var(--accent)',
        }),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
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
        <Typography component="span" sx={{ width: 24, textAlign: 'right', color: 'var(--text)' }}>
          {row.rank}
        </Typography>
      </Stack>

      <Stack spacing={0} sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
          {row.country ?? '—'}
        </Typography>
      </Stack>

      <Typography
        sx={{ textAlign: 'right', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}
      >
        {row.points.toLocaleString('hu-HU')} pt
      </Typography>
    </Box>
  );
};

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:640px)');
  const [q, setQ] = React.useState('');
  const [category, setCategory] = React.useState<string>('hu-history'); // csak UI

  const rows = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? MOCK.filter((r) => r.name.toLowerCase().includes(term)) : MOCK;
  }, [q]);

  return (
    <Stack alignItems="center" sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1040,
          px: { xs: 1.5, sm: 2 },
          boxSizing: 'border-box',
          margin: '0 auto',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          sx={{ mb: { xs: 1, sm: 2 } }}
        >
          Vissza
        </Button>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* ETTŐL KEZDVE MINDEN A KÁRTYÁN BELÜL VAN */}
            <Paper
              className="glass neon-border"
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                maxHeight: { xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 140px)' },
                boxSizing: 'border-box',
              }}
            >
              {/* Fejléc + szűrők */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.25}
                sx={{ flex: '0 0 auto' }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>
                    Ranglétra
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <TextField
                    select
                    size="small"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ minWidth: 240, width: { xs: '100%', sm: 260 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FilterAltIcon fontSize="small" sx={{ color: 'var(--muted)' }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </TextField>

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
                    sx={{ width: { xs: '100%', sm: 300 } }}
                  />
                </Stack>
              </Stack>

              {/* Lista – SZIGORÚAN a kártyán belül, nincs absolute, csak flex */}
              <Box
                // fontos: NE legyen className="menu-panel" máshol az oldalon position/absolute.
                className="leaderboard-scroll"
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(15, 10, 31, 0.40)',
                  p: { xs: 1.25, sm: 1.5 },
                  flex: '1 1 auto',
                  minHeight: 0,
                  overflow: 'auto',
                  boxSizing: 'border-box',
                }}
              >
                <Stack spacing={1}>
                  {rows.map((r) => (
                    <RowItem key={r.rank} row={r} />
                  ))}
                </Stack>
              </Box>

              {/* Lábléc */}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, flex: '0 0 auto' }}>
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

        <Box sx={{ height: 12 }} />
      </Box>
    </Stack>
  );
};

export default LeaderboardPage;
