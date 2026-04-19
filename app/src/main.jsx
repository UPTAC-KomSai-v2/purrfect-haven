import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';

/* Modify for the Page layers example Home.jsx */
createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
)
