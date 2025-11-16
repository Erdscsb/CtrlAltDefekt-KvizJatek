import React from 'react';
import { Button, Typography, Stack, Divider } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuButton from './MenuButton';
import ProfileIconMenu from './ProfileMenuIcon';
import { useNavigate } from 'react-router-dom';

const MainMenuCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="menu-panel">
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            Kvízjáték
          </Typography>
          <ProfileIconMenu />
        </Stack>

        <Typography className="subtle">
          Üdv! Válassz a menüpontok közül az induláshoz.
        </Typography>

        <Stack spacing={2}>
          <MenuButton
            icon={<SportsEsportsIcon />}
            label="Új játék"
            onClick={() => navigate('/new')} // <-- Navigate to /new
          />
          <MenuButton
            icon={<EmojiEventsIcon />}
            label="Ranglétra"
            variant="secondary"
            onClick={() => navigate('/leaderboard')} // <-- Navigate to /leaderboard
          />
          <MenuButton
            icon={<SettingsIcon />}
            label="Beállítások"
            variant="secondary"
            onClick={() => navigate('/settings')} // <-- Navigate to /leaderboard
          />
        </Stack>

        <Divider light />

        <Stack direction="row" spacing={1}>
          <Button size="small" variant="text" color="secondary" disabled>
            Súgó
          </Button>
          <Button size="small" variant="text" color="secondary" onClick={() => navigate('/profile')} >
            Profil
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default MainMenuCard;
