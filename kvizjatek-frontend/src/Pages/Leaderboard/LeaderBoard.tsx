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


import { useAuth } from '../../lib/useAuth';

type ApiRow = {
  rank: number;
  user_id: number;
  username: string;
  total_score: number;
};

type UiRow = {
  rank: number;
  name: string;
  points: number;
  country?: string;
};

const medalColor = (rank: number) => {
  if (rank === 1) return '#ffd54f';
  if (rank === 2) return '#cfd8dc';
  if (rank === 3) return '#ffb74d';
  return 'transparent';
};

const RowItem: React.FC<{ row: UiRow }> = ({ row }) => {
  const top3 = row.rank <= 3;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '52px 1fr auto', sm: '56px 1fr 120px' },
        gap: { xs: 2, sm: 3 },
        alignItems: 'center',
        padding: { xs: '12px', sm: '16px' },
        borderRadius: 3,

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
          transform: 'scale(1.01)',
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
  const { token } = useAuth(); // a saját AuthProvideredből
  const [q, setQ] = React.useState('');
  const [category, setCategory] = React.useState<string>('hu-history'); // UI-only

  const [rows, setRows] = React.useState<UiRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  type Topic = { id: number; name: string };

const [categories, setCategories] = React.useState<{ value: string; label: string }[]>([
  { value: 'hu-history', label: 'Magyarország történelme' },
  { value: 'world-history', label: 'Világtörténelem' },
  { value: 'science', label: 'Tudomány' },
  { value: 'geography', label: 'Földrajz' },
  { value: 'literature', label: 'Irodalom' },
  { value: 'sports', label: 'Sport' },
]);

React.useEffect(() => {
  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/topics/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) return;
      const mapped = (data as Topic[]).map((t) => ({ value: String(t.id), label: t.name }));
      if (mapped.length) setCategories(mapped);
    } catch {}
  };
  if (token) fetchTopics();
}, [token]);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/leaderboard/', {
         headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'A ranglista betöltése sikertelen.');
        }
        const mapped: UiRow[] = (Array.isArray(data) ? (data as ApiRow[]) : []).map((r) => ({
          rank: r.rank,
          name: r.username,
          points: r.total_score,
        }));
        setRows(mapped);
      } catch (err: any) {
        setError(err?.message || 'Ismeretlen hiba a ranglistánál.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchLeaderboard();
  }, [token]);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? rows.filter((r) => r.name.toLowerCase().includes(term)) : rows;
  }, [rows, q]);

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
                    {categories.map((c) => (
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

              {/* Lista */}
              <Box
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
                {loading && (
                  <Typography className="subtle" sx={{ p: 1 }}>
                    Betöltés…
                  </Typography>
                )}
                {error && (
                  <Typography color="error" sx={{ p: 1 }}>
                    {error}
                  </Typography>
                )}
                {!loading && !error && (
                  <Stack spacing={1}>
                    {filtered.length === 0 ? (
                      <Typography className="subtle" sx={{ p: 1 }}>
                        Még nincs adat a ranglistán.
                      </Typography>
                    ) : (
                      filtered.map((r) => <RowItem key={`${r.rank}-${r.name}`} row={r} />)
                    )}
                  </Stack>
                )}
              </Box>

              {/* Lábléc */}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, flex: '0 0 auto' }}>
                <Typography variant="caption" className="subtle">
                  Összes játékos: {rows.length}
                </Typography>
                <Typography variant="caption" className="subtle">
                  Adatok az API-ból
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