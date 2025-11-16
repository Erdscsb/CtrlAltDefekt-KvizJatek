import { createTheme } from '@mui/material/styles';

/**
 * Creates the Material-UI theme.
 *
 * This theme uses a STATIC color palette (based on the default purple theme)
 * to allow MUI's createTheme() function to build its color variants.
 *
 * We then apply DYNAMIC CSS variables (from global.css) in the
 * 'components' override section. This is the key to making the
 * components theme-aware.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',

    // --- STATIC FALLBACK PALETTE (Based on Purple) ---
    // These static colors are required by MUI to calculate
    // hover/disabled/light/dark shades.
    primary: {
      main: '#b27cff',
    },
    secondary: {
      main: '#7a4df3',
    },
    background: {
      default: '#0f0a1f',
      paper: 'rgba(20, 14, 40, 0.6)', // Fallback glass color
    },
    text: {
      primary: '#f3eefc',
      secondary: '#bfb3e6',
    },
  },

  // --- Global Component Shape ---
  shape: {
    borderRadius: 'var(--radius-md)',
  },

  // --- DYNAMIC COMPONENT OVERRIDES ---
  // This is where we use our CSS variables to make
  // components change with the theme.
  components: {
    // Override Paper components (used by GlassBackground, Cards, etc.)
    MuiPaper: {
      styleOverrides: {
        root: {
          // Use the DYNAMIC variables from global.css
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          
          backdropFilter: 'blur(16px) saturate(140%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'background 300ms ease, border 300ms ease',
        },
      },
    },
    // Override all Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 'var(--radius-md)',
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        // Style for: <Button variant="contained" color="primary">
        containedPrimary: {
          // Use the DYNAMIC gradient from global.css
          background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
          color: '#fff',
          '&:hover': {
            filter: 'brightness(1.05)',
          },
        },
      },
    },
  },
});

export default theme;
