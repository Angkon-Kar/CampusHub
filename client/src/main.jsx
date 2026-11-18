// client/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './pwa/installPrompt'; // starts listening for the install event right away
import { registerServiceWorker } from './pwa/registerServiceWorker';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerServiceWorker();