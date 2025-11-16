import React from 'react';
import { Button, Typography, Stack, Divider } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuButton from './MenuButton';
import ProfileIconMenu from './ProfileMenuIcon';

const MainMenuCard: React.FC = () => {
  return (
    <div className="menu-panel">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" fontWeight={700}>
            Kvízjáték
          </Typography>
          <ProfileIconMenu />
        </Stack>

        <Typography className="subtle">
          Üdv! Válassz a menüpontok közül az induláshoz.
        </Typography>

        <Stack spacing={2}>
          <MenuButton icon={<SportsEsportsIcon />} label="Új játék" />
          <MenuButton
            icon={<EmojiEventsIcon />}
            label="Ranglétra"
            variant="secondary"
          />
        </Stack>

        <Divider light />

        <Stack direction="row" spacing={1}>
          <Button size="small" variant="text" color="secondary">
            Súgó
          </Button>
          <Button size="small" variant="text" color="secondary">
            Beállítások
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default MainMenuCard;