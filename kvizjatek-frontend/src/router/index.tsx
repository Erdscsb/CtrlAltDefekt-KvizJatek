import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/Home/HomePage';
import LeaderboardPage from '../Pages/Leaderboard/LeaderBoard';
import LoginPage from '../Pages/Authentication/LoginPage';
import RegisterPage from '../Pages/Authentication/RegisterPage';
import ProfilePage from '../Pages/Profile/ProfilePage';
import NewGamePage from '../Pages/NewGame/NewGame';
import SettingsPage from '../Pages/Settings/SettingsPage';
import HelpPage from '../Pages/Help/Help';
import ProtectedRoute from './ProtectedRoute';
import QuizGamePage from '../Pages/Game/QuizGamePage';
import QuizResultPage from '../Pages/Result/QuizResultPage';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Routes protected by the wrapper */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewGamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/quiz/:quizId" element={<QuizGamePage />} />
        <Route path="/result/:resultId" element={<QuizResultPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
