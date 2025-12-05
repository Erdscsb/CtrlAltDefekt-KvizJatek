import React from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import TopicIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import LeaderboardIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';

type User = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
};

type Topic = {
  id: number;
  name: string;
};

type QuizMeta = {
  id: number;
  topic_name: string;
  difficulty: string;
  created_by_user_id: number;
  created_at: string;
};

type ResultItem = {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  completed_at: string;
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAdmin, isAuthenticated } = useAuth();

  const [tab, setTab] = React.useState(0);

  const [users, setUsers] = React.useState<User[]>([]);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [quizzes, setQuizzes] = React.useState<QuizMeta[]>([]);
  const [results, setResults] = React.useState<ResultItem[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const apiGet = React.useCallback(
    async (path: string) => {
      const res = await fetch(`/api${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataText = await res.text();
      let data: any = null;
      try {
        data = dataText ? JSON.parse(dataText) : null;
      } catch {
        throw new Error(`Nem JSON válasz: ${path}`);
      }
      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Hiba: ${res.status}`);
      }
      return data;
    },
    [token]
  );

  const apiSend = React.useCallback(
    async (path: string, method: 'POST' | 'PUT' | 'DELETE', body?: any) => {
      const res = await fetch(`/api${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        if (!res.ok) throw new Error(`Hiba ${method} ${path}`);
        return null;
      }
      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Hiba: ${res.status}`);
      }
      return data;
    },
    [token]
  );

  const loadUsers = React.useCallback(async () => {
    const data = await apiGet('/admin/users');
    setUsers(Array.isArray(data) ? data : []);
  }, [apiGet]);

  const loadTopics = React.useCallback(async () => {
    const data = await apiGet('/topics/');
    setTopics(Array.isArray(data) ? data : []);
  }, [apiGet]);

  const loadQuizzes = React.useCallback(async () => {
    const data = await apiGet('/quiz/');
    setQuizzes(Array.isArray(data) ? data : []);
  }, [apiGet]);

  const loadResults = React.useCallback(async () => {
    const data = await apiGet('/result/');
    setResults(Array.isArray(data) ? data : []);
  }, [apiGet]);

  const refreshAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadUsers(), loadTopics(), loadQuizzes(), loadResults()]);
    } catch (e: any) {
      setError(e?.message || 'Betöltési hiba');
    } finally {
      setLoading(false);
    }
  }, [loadUsers, loadTopics, loadQuizzes, loadResults]);

  React.useEffect(() => {
    if (token && isAdmin) refreshAll();
  }, [token, isAdmin, refreshAll]);

  const [userDialogOpen, setUserDialogOpen] = React.useState(false);
  const [userEdit, setUserEdit] = React.useState<User | null>(null);
  const [userForm, setUserForm] = React.useState<Partial<User & { password?: string }>>({});

  const openCreateUser = () => {
    setUserEdit(null);
    setUserForm({ username: '', email: '', password: '', is_admin: false });
    setUserDialogOpen(true);
  };

  const openEditUser = (u: User) => {
    setUserEdit(u);
    setUserForm({ username: u.username, email: u.email, is_admin: u.is_admin });
    setUserDialogOpen(true);
  };

  const submitUser = async () => {
    try {
      if (!userForm.username || !userForm.email || (!userEdit && !userForm.password)) {
        throw new Error('Hiányzó mező(k).');
      }
      if (userEdit) {
        await apiSend(`/admin/users/${userEdit.id}`, 'PUT', {
          username: userForm.username,
          email: userForm.email,
          password: userForm.password || undefined,
          is_admin: !!userForm.is_admin,
        });
      } else {
        await apiSend('/admin/users', 'POST', {
          username: userForm.username,
          email: userForm.email,
          password: userForm.password,
          is_admin: !!userForm.is_admin,
        });
      }
      setUserDialogOpen(false);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'Felhasználó mentése sikertelen');
    }
  };

  const deleteUser = async (u: User) => {
    if (!confirm(`Biztos törlöd a felhasználót? (${u.username})`)) return;
    try {
      await apiSend(`/admin/users/${u.id}`, 'DELETE');
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'Felhasználó törlése sikertelen');
    }
  };

  const [topicDialogOpen, setTopicDialogOpen] = React.useState(false);
  const [topicEdit, setTopicEdit] = React.useState<Topic | null>(null);
  const [topicName, setTopicName] = React.useState('');

  const openCreateTopic = () => {
    setTopicEdit(null);
    setTopicName('');
    setTopicDialogOpen(true);
  };

  const openEditTopic = (t: Topic) => {
    setTopicEdit(t);
    setTopicName(t.name);
    setTopicDialogOpen(true);
  };

  const submitTopic = async () => {
    try {
      if (!topicName.trim()) throw new Error('Név kötelező.');
      if (topicEdit) {
        await apiSend(`/topics/${topicEdit.id}`, 'PUT', { name: topicName.trim() });
      } else {
        await apiSend('/topics/', 'POST', { name: topicName.trim() });
      }
      setTopicDialogOpen(false);
      await loadTopics();
    } catch (e: any) {
      setError(e?.message || 'Téma mentése sikertelen');
    }
  };

  const deleteTopic = async (t: Topic) => {
    if (!confirm(`Biztos törlöd a témát? (${t.name})`)) return;
    try {
      await apiSend(`/topics/${t.id}`, 'DELETE');
      await loadTopics();
    } catch (e: any) {
      setError(e?.message || 'Téma törlése sikertelen (lehet, hogy használt).');
    }
  };

  if (!isAuthenticated) {
    return (
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Paper className="glass neon-border" elevation={0} sx={{ p: 3, maxWidth: 720 }}>
          <Typography>Bejelentkezés szükséges az admin felülethez.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Vissza
          </Button>
        </Paper>
      </Stack>
    );
  }

  if (!isAdmin) {
    return (
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Paper className="glass neon-border" elevation={0} sx={{ p: 3, maxWidth: 720 }}>
          <Typography>Hozzáférés megtagadva (403) – csak admin felhasználók érhetik el.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Vissza
          </Button>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" sx={{ mt: 2, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 1200, px: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} variant="text" color="secondary" onClick={() => navigate(-1)}>
            Vissza
          </Button>
          <Stack direction="row" spacing={1}>
            <Button startIcon={<RefreshIcon />} onClick={refreshAll}>
              Frissítés
            </Button>
          </Stack>
        </Stack>

        <Paper className="glass neon-border" elevation={0} sx={{ p: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ mb: 2 }}
          >
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Felhasználók" />
            <Tab icon={<TopicIcon />} iconPosition="start" label="Témák" />
            <Tab icon={<QuizIcon />} iconPosition="start" label="Kvízek" />
            <Tab icon={<LeaderboardIcon />} iconPosition="start" label="Eredmények" />
          </Tabs>

          {error && (
            <Typography color="error" sx={{ mb: 1.5 }}>
              {error}
            </Typography>
          )}

          {/* Felhasználók */}
          {tab === 0 && (
            <Box>
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button startIcon={<AddIcon />} onClick={openCreateUser}>
                  Új felhasználó
                </Button>
              </Stack>
              <Box className="leaderboard-scroll" sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                <Grid container spacing={1}>
                  {users.map((u) => (
                    <Grid key={u.id} item xs={12}>
                      <Paper elevation={0} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600 }}>{u.username}</Typography>
                          <Typography variant="caption" className="subtle">
                            {u.email}
                          </Typography>
                        </Box>
                        {u.is_admin && <Chip size="small" label="Admin" color="primary" />}
                        <IconButton onClick={() => openEditUser(u)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteUser(u)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* Témák */}
          {tab === 1 && (
            <Box>
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button startIcon={<AddIcon />} onClick={openCreateTopic}>
                  Új téma
                </Button>
              </Stack>
              <Box className="leaderboard-scroll" sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                <Grid container spacing={1}>
                  {topics.map((t) => (
                    <Grid key={t.id} item xs={12}>
                      <Paper elevation={0} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600 }}>{t.name}</Typography>
                        </Box>
                        <IconButton onClick={() => openEditTopic(t)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTopic(t)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* Kvízek */}
          {tab === 2 && (
            <Box className="leaderboard-scroll" sx={{ maxHeight: '70vh', overflow: 'auto' }}>
              <Grid container spacing={1}>
                {quizzes.map((q) => (
                  <Grid key={q.id} item xs={12}>
                    <Paper elevation={0} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }}>{q.topic_name}</Typography>
                        <Typography variant="caption" className="subtle">
                          #{q.id} • {q.difficulty} • {new Date(q.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Eredmények */}
          {tab === 3 && (
            <Box className="leaderboard-scroll" sx={{ maxHeight: '70vh', overflow: 'auto' }}>
              <Grid container spacing={1}>
                {results.map((r) => {
                  const pct = Math.round((r.score / Math.max(1, r.total_questions)) * 100);
                  return (
                    <Grid key={r.id} item xs={12}>
                      <Paper elevation={0} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            User #{r.user_id} • Quiz #{r.quiz_id}
                          </Typography>
                          <Typography variant="caption" className="subtle">
                            {new Date(r.completed_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Chip size="small" label={`${pct} %`} />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Felhasználó dialógus */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{userEdit ? 'Felhasználó szerkesztése' : 'Új felhasználó'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Felhasználónév"
              value={userForm.username || ''}
              onChange={(e) => setUserForm((s) => ({ ...s, username: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email || ''}
              onChange={(e) => setUserForm((s) => ({ ...s, email: e.target.value }))}
              fullWidth
            />
            {!userEdit && (
              <TextField
                label="Jelszó"
                type="password"
                value={userForm.password || ''}
                onChange={(e) => setUserForm((s) => ({ ...s, password: e.target.value }))}
                fullWidth
              />
            )}
            <TextField
              select
              label="Szerep"
              value={userForm.is_admin ? 'admin' : 'user'}
              onChange={(e) => setUserForm((s) => ({ ...s, is_admin: e.target.value === 'admin' }))}
              fullWidth
            >
              <MenuItem value="user">Felhasználó</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Mégse</Button>
          <Button onClick={submitUser} variant="contained">
            Mentés
          </Button>
        </DialogActions>
      </Dialog>

      {/* Téma dialógus */}
      <Dialog open={topicDialogOpen} onClose={() => setTopicDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{topicEdit ? 'Téma szerkesztése' : 'Új téma'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Téma neve"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopicDialogOpen(false)}>Mégse</Button>
          <Button onClick={submitTopic} variant="contained">
            Mentés
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminPage;