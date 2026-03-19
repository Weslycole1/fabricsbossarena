import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // <-- ADD THIS
import 'bootstrap/dist/css/bootstrap.min.css'     // <-- ADD THIS
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>     {/* <-- WRAP APP WITH ROUTER */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)

