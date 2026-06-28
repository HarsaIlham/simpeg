import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </LocalizationProvider>
    </AuthProvider>
  </StrictMode>,
)
