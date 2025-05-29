import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/globals.css'
import App from './App.tsx'
import { NuiProvider } from './context/NuiContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuiProvider>
      <App />
    </NuiProvider>
  </StrictMode>,
)
