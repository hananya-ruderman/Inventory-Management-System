import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import UserProvider from './state/context.tsx';
import App from './App.tsx'
import { ThemeProvider } from '@mui/material';
import {CssBaseline} from '@mui/material';
import theme from './muiUtils/muiTheme.ts'

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <UserProvider>
        <App />
      </UserProvider>

    </ThemeProvider>
  </BrowserRouter>
</StrictMode>
)
