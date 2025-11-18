import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b27cff',
    },
    secondary: {
      main: '#7a4df3',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(20, 14, 40, 0.6)',
    },
    text: {
      primary: '#f3eefc',
      secondary: '#bfb3e6',
    },
  },
  
  shape: {
    borderRadius: 16,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px) saturate(180%)',
          borderTop: '1px solid var(--glass-border-light)',
          borderLeft: '1px solid var(--glass-border-light)',
          borderBottom: '1px solid var(--glass-border-dark)',
          borderRight: '1px solid var(--glass-border-dark)',
          boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.2)',
          transition: 'background 0.3s ease, border 0.3s ease, transform 0.2s ease',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          color: '#ffffff',
          fontWeight: 700,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 0 10px var(--accent-glow)',
        },
      },
    },

    // 3. Buttons with Glow
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 'var(--radius-sm)',
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          color: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: '0 0 20px var(--accent-glow)', 
            filter: 'brightness(1.1)',
          },
        },
        outlinedSecondary: {
          borderColor: 'var(--glass-border-light)',
          color: 'var(--text-secondary)',
          '&:hover': {
            borderColor: 'var(--accent)',
            color: 'var(--text)',
            background: 'rgba(255,255,255,0.03)',
          },
        },
      },
    },

    // 4. Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 'var(--radius-sm)',
          '& fieldset': { borderColor: 'var(--glass-border-light)' },
          '&:hover fieldset': { borderColor: 'var(--accent)' },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--accent)',
            borderWidth: '1px',
            boxShadow: '0 0 8px var(--accent-glow)',
          },
        },
        input: { color: 'var(--text)' }
      },
    },
    
    // 5. Typography overrides
    MuiTypography: {
      styleOverrides: {
        root: { color: 'inherit' },
        h1: { textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
        h4: { textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
      }
    },

    // 6. Menu Items (Dropdowns)
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'var(--accent-glow)',
            color: '#fff',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--accent) !important',
            color: '#fff',
          }
        }
      }
    }
  },
});

export default theme;
