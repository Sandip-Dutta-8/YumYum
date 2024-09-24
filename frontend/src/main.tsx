import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
import { ThemeProvider } from "@/components/theme-provider"
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Auth0ProviderWithNavigate>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AppRoutes />
        </ThemeProvider>
      </Auth0ProviderWithNavigate>
    </Router>
  </StrictMode>,
)
