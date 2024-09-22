import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
import { ThemeProvider } from "@/components/theme-provider"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </Router>
  </StrictMode>,
)
