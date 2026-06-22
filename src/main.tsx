import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from '@/lib/queryClient'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { BrandingProvider } from '@/features/partners/BrandingProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrandingProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BrandingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
