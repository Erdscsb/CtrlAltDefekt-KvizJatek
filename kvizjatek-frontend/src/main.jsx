import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import MuiTheme from './styles/theme';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { ThemeProvider } from './lib/useTheme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MuiThemeProvider theme={MuiTheme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </MuiThemeProvider>
    </ThemeProvider>
  </StrictMode>
)
