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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useNavigate } from 'react-router-dom';

type PlayedGame = {
  id: string;
  topic: string;
  points: number;
  date?: string;
};

type ProfileData = {
  name: string;
  games: PlayedGame[];
};

const MOCK_PROFILE: ProfileData = {
  name: 'Játékos',
  games: [
    { id: 'QZ-10231', topic: 'Magyarország történelme', points: 820 },
    { id: 'QZ-10211', topic: 'Tudomány', points: 640 },
    { id: 'QZ-10198', topic: 'Világtörténelem', points: 910 },
    { id: 'QZ-10180', topic: 'Irodalom', points: 740 },
    { id: 'QZ-10160', topic: 'Földrajz', points: 890 },
    { id: 'QZ-10155', topic: 'Sport', points: 560 },
    { id: 'QZ-10140', topic: 'Magyarország történelme', points: 990 },
    { id: 'QZ-10135', topic: 'Irodalom', points: 720 },
    { id: 'QZ-10120', topic: 'Tudomány', points: 880 },
    { id: 'QZ-10110', topic: 'Földrajz', points: 770 },
    { id: 'QZ-10105', topic: 'Világtörténelem', points: 930 },
    { id: 'QZ-10090', topic: 'Sport', points: 610 },
    { id: 'QZ-10075', topic: 'Irodalom', points: 780 },
    { id: 'QZ-10070', topic: 'Tudomány', points: 845 },
    { id: 'QZ-10065', topic: 'Földrajz', points: 695 },
    { id: 'QZ-10050', topic: 'Magyarország történelme', points: 960 },
  ],
};

const calcStats = (games: PlayedGame[]) => {
  const totalGames = games.length;
  const totalPoints = games.reduce((s, g) => s + g.points, 0);
  const best = games.reduce((m, g) => Math.max(m, g.points), 0);
  const avg = totalGames ? Math.round(totalPoints / totalGames) : 0;
  return { totalGames, totalPoints, avg, best };
};

const AchievementChip: React.FC<{ active: boolean; label: string }> = ({ active, label }) => (
  <Chip
    icon={<WorkspacePremiumIcon />}
    label={label}
    variant={active ? 'filled' : 'outlined'}
    sx={{
      borderColor: active ? 'transparent' : 'var(--glass-border-light)',
      bgcolor: active ? 'var(--accent-glow)' : 'transparent',
      color: active ? '#fff' : 'var(--text-secondary)',
      fontWeight: active ? 700 : 400,
      boxShadow: active ? '0 0 10px var(--accent-glow)' : 'none',
    }}
  />
);

const GameRow: React.FC<{ game: PlayedGame }> = ({ game }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr auto', sm: '180px 1fr 120px' },
      gap: { xs: 2, sm: 3 },
      alignItems: 'center',
      padding: '12px 16px',
      borderRadius: 3,
      borderTop: '1px solid var(--glass-border-light)',
      borderBottom: '1px solid var(--glass-border-dark)',
      background: 'rgba(255,255,255,0.02)',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(255,255,255,0.05)',
        transform: 'translateX(4px)',
        borderColor: 'var(--accent)',
      }
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
      <SportsEsportsIcon sx={{ color: 'var(--text-secondary)', fontSize: 20 }} />
      <Typography variant="body2" className="subtle">{game.id}</Typography>
    </Stack>

    <Stack spacing={0} sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 600 }} noWrap>{game.topic}</Typography>
      <Typography variant="caption" className="subtle" sx={{ display: { sm: 'none' } }}>{game.id}</Typography>
    </Stack>

    <Typography sx={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
      {game.points.toLocaleString('hu-HU')} pt
    </Typography>
  </Box>
);

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const data = MOCK_PROFILE;
  const { totalGames, totalPoints, avg, best } = calcStats(data.games);

  // achievement küszöbök
  const a10k = totalPoints >= 10000;
  const a20k = totalPoints >= 20000;
  const a40g = totalGames >= 40;
  const a100g = totalGames >= 100;

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
              {/* Fejléc: név + statok */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ flex: '0 0 auto' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    {data.name[0]?.toUpperCase()}
                  </Avatar>
                  <Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {data.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ mt: 0.5, flexWrap: 'wrap' }}
                      alignItems="center"
                    >
                      <StatPill label="Összes pont" value={totalPoints.toLocaleString('hu-HU')} />
                      <StatPill label="Összes játék" value={totalGames.toString()} />
                      <StatPill label="Átlag/játék" value={`${avg} pt`} />
                      <StatPill label="Legjobb pont" value={`${best} pt`} />
                    </Stack>
                  </Stack>
                </Stack>

                {/* Achievements */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <AchievementChip active={a10k} label="10 000 pont" />
                  <AchievementChip active={a20k} label="20 000 pont" />
                  <AchievementChip active={a40g} label="40 játék" />
                  <AchievementChip active={a100g} label="100 játék" />
                </Stack>
              </Stack>

              {/* Lejátszott kvízek lista */}
              <Box
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
                className="leaderboard-scroll"
              >
                <Stack spacing={1}>
                  {data.games.map((g, i) => (
                    <GameRow key={g.id} game={g} />
                  ))}
                </Stack>
              </Box>

              {/* Lábléc */}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, flex: '0 0 auto' }}>
                <Typography variant="caption" className="subtle">
                  Összes játék: {totalGames}
                </Typography>
                <Typography variant="caption" className="subtle">
                  Demo profil – később API-ból
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

/* Kis belső komponens a stat pill-ekhez */
const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
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
};
