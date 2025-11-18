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
      <Box sx={{ width: '100%', maxWidth: '44rem' }}>
        <GlassBackground className="menu-surface">
          <Box sx={{ width: '100%' }}>
            
            <Stack spacing={3}>
              {/* Header Section */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h5" fontWeight={800} className="gradient-text">
                    {quiz.topic_name}
                  </Typography>
                  <Chip 
                    label={quiz.difficulty} 
                    sx={{ 
                      bgcolor: 'var(--accent-glow)', 
                      color: '#fff', 
                      fontWeight: 'bold',
                      border: '1px solid var(--accent)'
                    }} 
                  />
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" className="subtle">Haladás</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: 'var(--accent)' }}>
                    {currentQuestionIndex + 1} / {quiz.questions.length}
                  </Typography>
                </Stack>

                {/* Neon Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ 
                    mt: 1, 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                      boxShadow: '0 0 10px var(--accent-glow)' 
                    }
                  }}
                />
              </Box>

              {/* Question Card - Uses the new Theme Paper automatically */}
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentQuestion.question_text}
                </Typography>
              </Paper>

              {/* Answer Buttons */}
              <Stack spacing={1.5}>
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getButtonColor(option) === 'primary' ? 'contained' : 'outlined'}
                    color={getButtonColor(option) as any}
                    onClick={() => handleAnswer(option)}
                    disabled={loading} 
                    sx={{
                      justifyContent: 'flex-start',
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '1rem',
                      borderColor: isAnswered && option !== selectedAnswer ? 'transparent' : undefined,
                      opacity: isAnswered && option !== selectedAnswer ? 0.5 : 1,
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Stack>
              
              {/* Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!isAnswered || loading}
                  size="large"
                  sx={{ px: 4 }}
                >
                  {loading 
                    ? <CircularProgress size={24} color="inherit" />
                    : (currentQuestionIndex === quiz.questions.length - 1 ? 'Befejezés' : 'Következő')
                  }
                </Button>
              </Box>
              
            </Stack>
          </Box>
        </GlassBackground>
      </Box>
    </CenterStage>
  );
};

export default QuizGamePage;
