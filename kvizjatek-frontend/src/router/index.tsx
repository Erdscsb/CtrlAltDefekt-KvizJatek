import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/Home/HomePage';
import LeaderboardPage from '../Pages/Leaderboard/LeaderboardPage';
import LoginPage from '../Pages/Authentication/LoginPage';
import RegisterPage from '../Pages/Authentication/RegisterPage';
import ProfilePage from '../Pages/Profile/ProfilePage';
import NewGamePage from '../Pages/NewGame/NewGamePage';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new" element={<NewGamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default Router;