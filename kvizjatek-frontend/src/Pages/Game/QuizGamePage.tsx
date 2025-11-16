import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  Paper,
} from '@mui/material';
import CenterStage from '../../Components/Layout/CenterStage';
import GlassBackground from '../../Components/Layout/GlassBackground';
import { useAuth } from '../../lib/useAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// API válasz típusok
interface Question {
  id: number;
  question_text: string;
  options: string[];
}

interface Quiz {
  id: number;
  topic_name: string;
  difficulty: string;
  questions: Question[];
}

// A válasz, amit gyűjtünk
interface Answer {
  question_id: number;
  selected_answer: string;
}

const QuizGamePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 1. Kvíz adatainak letöltése
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'A kvíz betöltése sikertelen.');
        }
        setQuiz(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
        fetchQuiz();
    }
  }, [quizId, token]);

  // 2. Eredmény elküldése
  const submitResult = async () => {
    setLoading(true); // Mutassuk a töltést a beküldés alatt
    try {
      const response = await fetch('/api/result/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quiz?.id,
          answers: userAnswers,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Az eredmény mentése sikertelen.');
      }
      // Navigálás az eredmény oldalra az új Result ID-val
      navigate(`/result/${data.result_id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Hiba esetén állítsuk le a töltést
    }
  };

  // 3. Válasz kezelése
  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    // Mentsük el a választ
    setUserAnswers(prev => [
      ...prev,
      {
        question_id: quiz!.questions[currentQuestionIndex].id,
        selected_answer: option
      }
    ]);
  };

  // 4. Következő kérdés / Befejezés
  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quiz!.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Vége a kvíznek, küldjük el az eredményt
      submitResult();
    }
  };
  
  // 5. Gomb stílus (csak azt jelzi, mit választottunk)
  const getButtonColor = (option: string): "inherit" | "primary" => {
    if (!isAnswered) {
      return 'inherit';
    }
    return (option === selectedAnswer) ? 'primary' : 'inherit';
  };

  // --- Renderelés ---

  if (loading && !quiz) {
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

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <CenterStage>
      <GlassBackground className="menu-surface">
        <Box sx={{ width: '100%', maxWidth: 700, p: { xs: 2, sm: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h5" fontWeight={700}>
                  {quiz.topic_name}
                </Typography>
                <Chip label={`Nehézség: ${quiz.difficulty}`} color="secondary" />
              </Stack>
              <Typography variant="body2" color="var(--muted)">
                {`Kérdés ${currentQuestionIndex + 1} / ${quiz.questions.length}`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>

            <Paper 
                elevation={0}
                sx={{ 
                    p: 2, 
                    background: 'rgba(15, 10, 31, 0.40)',
                    border: '1px solid rgba(255,255,255,0.06)'
                }}
            >
                <Typography variant="h6" sx={{ minHeight: '60px', textAlign: 'center' }}>
                {currentQuestion.question_text}
                </Typography>
            </Paper>

            <Stack spacing={1.5}>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={getButtonColor(option) === 'primary' ? 'contained' : 'outlined'}
                  color={getButtonColor(option)}
                  onClick={() => handleAnswer(option)}
                  disabled={loading} // tiltsuk le, amíg a válasz mentése/következő kérdés tölt
                  sx={{
                    justifyContent: 'flex-start',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {option}
                </Button>
              ))}
            </Stack>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isAnswered || loading}
              sx={{ py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
            >
              {loading 
                ? <CircularProgress size={24} color="inherit" />
                : (currentQuestionIndex === quiz.questions.length - 1
                  ? 'Kvíz befejezése'
                  : 'Következő kérdés')
              }
            </Button>
            
          </Stack>
        </Box>
      </GlassBackground>
    </CenterStage>
  );
};

export default QuizGamePage;