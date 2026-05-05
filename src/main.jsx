import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { RideProvider } from './context/RideContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <RideProvider>
        <App />
      </RideProvider>
    </AppProvider>
  </StrictMode>,
);
