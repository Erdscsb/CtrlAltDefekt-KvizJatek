import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import CenterStage from '../../Components/Layout/CenterStage';
import GlassBackground from '../../Components/Layout/GlassBackground';
import { useAuth } from '../../lib/useAuth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';

interface Result {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
  quiz_topic_name: string;
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
        const response = await fetch(`/api/result/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Hiba.');
        setResult(data);
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    if (token) fetchResult();
  }, [resultId, token]);

  if (loading) return <CenterStage><CircularProgress /></CenterStage>;
  if (error) return <CenterStage><Alert severity="error">{error}</Alert></CenterStage>;
  if (!result) return null;

  const percentage = Math.round((result.score / result.total_questions) * 100);
  let feedback = "Szép volt!";
  if (percentage === 100) feedback = "Tökéletes!";
  else if (percentage < 50) feedback = "Gyakorlásnak jó!";

  return (
    <CenterStage>
      <Box sx={{ width: '100%', maxWidth: '40rem' }}>
        <GlassBackground className="menu-surface">
          <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
            
            {/* Trophy Icon with Glow */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'transparent',
                border: '2px solid var(--accent)',
                boxShadow: '0 0 20px var(--accent-glow)'
              }}>
                <EmojiEventsIcon sx={{ fontSize: 40, color: 'var(--accent)' }} />
              </Avatar>
            </Box>

            <Typography variant="h4" fontWeight={800} className="gradient-text" gutterBottom>
              {feedback}
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
              Téma: <strong style={{ color: 'var(--text)' }}>{result.quiz_topic_name}</strong>
            </Typography>

            {/* Score Display */}
            <Box sx={{ 
              mb: 5, 
              p: 3, 
              borderRadius: 4, 
              background: 'rgba(0,0,0,0.2)', 
              border: '1px solid var(--glass-border-light)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '4rem', sm: '5rem' }, lineHeight: 1 }}>
                {percentage}%
              </Typography>
              <Typography variant="h6" sx={{ color: 'var(--accent)', fontWeight: 600, mt: 1 }}>
                {result.score} / {result.total_questions} helyes válasz
              </Typography>
            </Box>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={RouterLink}
                to="/new"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<ReplayIcon />}
              >
                Új Játék
              </Button>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<HomeIcon />}
              >
                Főmenü
              </Button>
            </Stack>

          </Box>
        </GlassBackground>
      </Box>
    </CenterStage>
  );
};

export default QuizResultPage;
