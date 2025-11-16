import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#b27cff' },
    secondary: { main: '#7a4df3' },
    background: {
      default: '#0f0a1f',
      paper: 'rgba(20, 14, 40, 0.6)',
    },
    text: {
      primary: '#f3eefc',
      secondary: '#bfb3e6',
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px) saturate(140%)',
          border: '1px solid rgba(180, 120, 240, 0.25)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 12 },
      },
    },
  },
});

export default theme;