import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useAppTheme, AppTheme } from '../../lib/useTheme';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useAppTheme();

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1">Színséma</Typography>
      <FormControl size="small">
        <InputLabel id="theme-label">Téma</InputLabel>
        <Select<AppTheme>
          labelId="theme-label"
          id="theme"
          label="Téma"
          value={theme}
          onChange={(e) => setTheme(e.target.value as AppTheme)}
        >
          <MenuItem value="purple">Lila (alap)</MenuItem>
          <MenuItem value="green">Zöld</MenuItem>
          <MenuItem value="blue">Kék</MenuItem>
          <MenuItem value="red">Piros</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ThemeSelector;