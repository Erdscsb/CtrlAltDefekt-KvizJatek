import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import MuiTheme from './styles/theme';
import './styles/global.css';
import { ThemeProvider } from './lib/useTheme';
import { AuthProvider } from './lib/useAuth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MuiThemeProvider theme={MuiTheme}>
        <BrowserRouter>
        <AuthProvider>
          <App />
          </AuthProvider>
        </BrowserRouter>
    </MuiThemeProvider>
    </ThemeProvider>
  </StrictMode>
)
