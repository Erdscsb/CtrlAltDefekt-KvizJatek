import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';

type StoredUser = {
  id: number;
  username: string;
};

type ResultItem = {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
};

type QuizMeta = { topic_name?: string; difficulty?: string };

const quizMetaCache = new Map<number, QuizMeta>();

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box
    sx={{
      px: 1.25,
      py: 0.5,
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.04)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
    }}
  >
    <MilitaryTechIcon sx={{ fontSize: 16, color: 'var(--muted)' }} />
    <Typography variant="caption" className="subtle">
      {label}:
    </Typography>
    <Typography variant="caption" sx={{ color: 'var(--text)', fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

const AchievementChip: React.FC<{ active: boolean; label: string }> = ({
  active,
  label,
}) => (
  <Chip
    icon={<WorkspacePremiumIcon />}
    label={label}
    color={active ? 'primary' : 'default'}
    variant={active ? 'filled' : 'outlined'}
    sx={{
      borderColor: active ? 'transparent' : 'rgba(255,255,255,0.25)',
      bgcolor: active ? 'rgba(178,124,255,0.18)' : 'transparent',
    }}
  />
);

const GameRow: React.FC<{ game: { id: string; topic: string; points: number } }> = ({
  game,
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr auto', sm: '180px 1fr 120px' },
      gap: { xs: 8, sm: 12 },
      alignItems: 'center',
      padding: { xs: '8px 10px', sm: '10px 12px' },
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
      boxSizing: 'border-box',
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
      <SportsEsportsIcon sx={{ color: 'var(--muted)' }} />
      <Typography variant="body2" className="subtle">
        {game.id}
      </Typography>
    </Stack>

    <Stack spacing={0} sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 600 }} noWrap>
        {game.topic}
      </Typography>
      <Typography variant="caption" className="subtle" sx={{ display: { sm: 'none' } }}>
        {game.id}
      </Typography>
    </Stack>

    <Typography
      sx={{
        textAlign: 'right',
        fontWeight: 700,
        color: 'var(--text)',
        whiteSpace: 'nowrap',
      }}
    >
      {game.points.toLocaleString('hu-HU')} pt
    </Typography>
  </Box>
);

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const stored = React.useMemo<StoredUser | null>(() => {
    try {
      const raw = localStorage.getItem('quiz-user');
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  }, []);

  const [results, setResults] = React.useState<ResultItem[]>([]);
  const [games, setGames] = React.useState<{ id: string; topic: string; points: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/result/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Eredmények betöltése sikertelen.');
        setResults(Array.isArray(data) ? (data as ResultItem[]) : []);
      } catch (e: any) {
        setError(e?.message || 'Ismeretlen hiba a profilnál.');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadResults();
  }, [token]);

  React.useEffect(() => {
    let active = true;
    const enrich = async () => {
      const out: { id: string; topic: string; points: number }[] = [];
      for (const r of results) {
        let topic = 'Ismeretlen téma';
        try {
          if (quizMetaCache.has(r.quiz_id)) {
            const cached = quizMetaCache.get(r.quiz_id)!;
            topic = cached.topic_name || topic;
          } else {
            const qRes = await fetch(`/api/quiz/${r.quiz_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const qData = await qRes.json();
            if (qRes.ok) {
              const meta: QuizMeta = { topic_name: qData?.topic_name, difficulty: qData?.difficulty };
              quizMetaCache.set(r.quiz_id, meta);
              topic = meta.topic_name || topic;
            }
          }
        } catch {}

        const pct = Math.round((r.score / Math.max(1, r.total_questions)) * 100);
        out.push({ id: `QZ-${r.quiz_id}`, topic, points: pct });
      }
      if (active) setGames(out);
    };
    if (results.length) enrich();
    else setGames([]);
    return () => {
      active = false;
    };
  }, [results, token]);

  const totalGames = games.length;
  const totalPoints = games.reduce((s, g) => s + g.points, 0);
  const best = games.reduce((m, g) => Math.max(m, g.points), 0);
  const avg = totalGames ? Math.round((totalPoints / totalGames) * 10) / 10 : 0;

  const a10k = totalPoints >= 10000;
  const a20k = totalPoints >= 20000;
  const a40g = totalGames >= 40;
  const a100g = totalGames >= 100;

  if (!token) {
    return (
      <Stack alignItems="center" sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
        <Box sx={{ width: '100%', maxWidth: 1040, px: { xs: 1.5, sm: 2 } }}>
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
          <Paper className="glass neon-border" elevation={0} sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography>Bejelentkezés szükséges a profil megtekintéséhez.</Typography>
          </Paper>
        </Box>
      </Stack>
    );
  }

  const displayName = stored?.username || 'Játékos';

  return (
    <Stack alignItems="center" sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 1040, px: { xs: 1.5, sm: 2 }, boxSizing: 'border-box' }}>
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
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ flex: '0 0 auto' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    {displayName[0]?.toUpperCase()}
                  </Avatar>
                  <Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {displayName}
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.5, flexWrap: 'wrap' }} alignItems="center">
                      <StatPill label="Összes pont" value={totalPoints.toLocaleString('hu-HU')} />
                      <StatPill label="Összes játék" value={totalGames.toString()} />
                      <StatPill label="Átlag/játék" value={`${avg} pt`} />
                      <StatPill label="Legjobb pont" value={`${best} pt`} />
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <AchievementChip active={a10k} label="10 000 pont" />
                  <AchievementChip active={a20k} label="20 000 pont" />
                  <AchievementChip active={a40g} label="40 játék" />
                  <AchievementChip active={a100g} label="100 játék" />
                </Stack>
              </Stack>

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
                    {games.length === 0 ? (
                      <Typography className="subtle" sx={{ p: 1 }}>
                        Még nincs lejátszott kvíz.
                      </Typography>
                    ) : (
                      games.map((g) => <GameRow key={g.id} game={g} />)
                    )}
                  </Stack>
                )}
              </Box>

              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, flex: '0 0 auto' }}>
                <Typography variant="caption" className="subtle">
                  Összes játék: {totalGames}
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

export default ProfilePage;