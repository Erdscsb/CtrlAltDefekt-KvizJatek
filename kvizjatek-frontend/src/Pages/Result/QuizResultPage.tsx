import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import CenterStage from '../../Components/Layout/CenterStage';
import GlassBackground from '../../Components/Layout/GlassBackground';
import { useAuth } from '../../lib/useAuth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// API válasz típusa
interface Result {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
  quiz_topic_name: string; // Ezt hozzáadtuk a backend válaszhoz
}

const QuizResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const { token } = useAuth();
  
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lekérjük az eredményt a backendről
        const response = await fetch(`/api/result/${resultId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Az eredmény betöltése sikertelen.');
        }
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
        fetchResult();
    }
  }, [resultId, token]);

  if (loading) {
    return (
      <CenterStage>
        <CircularProgress />
      </CenterStage>
    );
  }

  if (error) {
    return (
      <CenterStage>
        <Alert severity="error">{error}</Alert>
      </CenterStage>
    );
  }

  if (!result) return null;

  const percentage = (result.score / result.total_questions) * 100;

  return (
    <CenterStage>
      <GlassBackground className="menu-surface">
        <Box sx={{ width: '100%', maxWidth: 500, p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3} alignItems="center">
            <EmojiEventsIcon sx={{ fontSize: 60, color: 'var(--accent)' }} />
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Eredmény
            </Typography>
            
            <Typography variant="body1" color="var(--muted)" sx={{ mt: -2 }}>
              "{result.quiz_topic_name}"
            </Typography>

            <Typography variant="h3" fontWeight={700} color="primary.main">
              {result.score} / {result.total_questions}
            </Typography>
            
            <Chip 
              label={`${percentage.toFixed(0)}%`} 
              color={percentage >= 50 ? "success" : "error"} 
              variant="filled" 
              sx={{ fontSize: '1.2rem', fontWeight: 600, px: 2, py: 2.5 }}
            />
            
            <Typography variant="body2" color="var(--muted)">
              Befejezve: {new Date(result.completed_at).toLocaleString('hu-HU')}
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ width: '100%', mt: 2 }}>
              <Button
                component={RouterLink}
                to="/new"
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Új Játék
              </Button>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Főmenü
              </Button>
            </Stack>
          </Stack>
        </Box>
      </GlassBackground>
    </CenterStage>
  );
};

export default QuizResultPage;