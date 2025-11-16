import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Slider,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CenterStage from '../../Components/Layout/CenterStage';
import GlassBackground from '../../Components/Layout/GlassBackground';
import { useAuth } from '../../lib/useAuth';

type Topic = {
  id: number;
  name: string;
};

const DIFFICULTIES = [
  { value: 'Easy', label: 'Könnyű' },
  { value: 'Medium', label: 'Közepes' },
  { value: 'Hard', label: 'Nehéz' },
];

const NewGamePage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | ''>('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [aiGenerate, setAiGenerate] = useState(true); // Default to AI generation

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch topics on mount
  useEffect(() => {
    fetch('/api/topics/')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
      })
      .catch((err) => console.error('Failed to load topics', err));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare payload for POST /api/quiz
      const payload = {
        topic_id: selectedTopicId || null,
        custom_topic: selectedTopicId ? null : customTopic, // If dropdown is used, ignore custom text
        difficulty,
        num_questions: numQuestions,
        ai_generate: aiGenerate,
      };

      if (!payload.topic_id && !payload.custom_topic) {
        throw new Error('Kérlek válassz témát vagy adj meg egyet!');
      }

      const res = await fetch('/api/quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Hiba a kvíz létrehozása során.');
      }

      // Navigate to the player (which we will build next)
      // Assuming the route will be /quiz/:id
      navigate(`/quiz/${data.quiz_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterStage>
      <GlassBackground className="menu-surface">
        <Box sx={{ width: '100%', maxWidth: 600, p: 2 }}>
          <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
            Új Játék Indítása
          </Typography>

          <Stack spacing={3}>
            {/* Topic Selection */}
            <TextField
              select
              label="Válassz témát"
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(Number(e.target.value));
                setCustomTopic(''); // Clear custom if existing selected
              }}
              fullWidth
            >
              <MenuItem value="">
                <em>Egyedi téma megadása...</em>
              </MenuItem>
              {topics.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Custom Topic Input (only if no preset topic selected) */}
            <TextField
              label="Egyedi téma (pl. 'Harry Potter varázsigék')"
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setSelectedTopicId(''); // Clear preset if typing custom
              }}
              disabled={selectedTopicId !== ''}
              fullWidth
              helperText={
                selectedTopicId !== ''
                  ? 'Előre definiált téma kiválasztva.'
                  : 'Írj be bármit, az AI generálni fog belőle!'
              }
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Nehézség"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                fullWidth
              >
                {DIFFICULTIES.map((d) => (
                  <MenuItem key={d.value} value={d.value}>
                    {d.label}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ width: '100%', px: 1 }}>
                <Typography gutterBottom variant="caption">
                  Kérdések száma: {numQuestions}
                </Typography>
                <Slider
                  value={numQuestions}
                  onChange={(_, v) => setNumQuestions(v as number)}
                  min={3}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={aiGenerate}
                  onChange={(e) => setAiGenerate(e.target.checked)}
                  color="secondary"
                />
              }
              label={
                <Stack direction="row" alignItems="center" gap={1}>
                  <AutoAwesomeIcon
                    fontSize="small"
                    sx={{ color: 'var(--accent)' }}
                  />
                  <Typography>AI Generálás (ChatGPT)</Typography>
                </Stack>
              }
            />

            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleStart}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <PlayArrowIcon />
              }
              sx={{
                mt: 2,
                py: 1.5,
                background:
                  'linear-gradient(45deg, var(--accent), var(--accent-2))',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Generálás folyamatban...' : 'Kvíz Indítása'}
            </Button>
          </Stack>
        </Box>
      </GlassBackground>
    </CenterStage>
  );
};

export default NewGamePage;
