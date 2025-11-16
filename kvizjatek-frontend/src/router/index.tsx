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

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new" element={<NewGamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
    </Routes>
  );
};

export default Router;