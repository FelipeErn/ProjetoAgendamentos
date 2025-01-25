import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { StrictMode } from 'react';
import * as React from 'react';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
