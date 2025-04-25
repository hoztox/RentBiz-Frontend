import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Theme (pick one or change to a different one like 'lara-dark-blue')
import 'primereact/resources/primereact.min.css'; // Core PrimeReact styles
import 'primeicons/primeicons.css'; // PrimeIcons (for icons used across PrimeReact components)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
