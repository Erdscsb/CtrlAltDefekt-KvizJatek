import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import ThemeSelector from '../../Components/Settings/ThemeSelector';

const SettingsPage: React.FC = () => {
  return (
    <Stack alignItems="center" mt={6}>
      <Paper elevation={0} sx={{ p: 4, width: 480 }} className="glass neon-border">
        <Typography variant="h5" mb={2}>Beállítások</Typography>
        <ThemeSelector />
      </Paper>
    </Stack>
  );
};

export default SettingsPage;