import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from '@/app';
import outputs from '../amplify_outputs.json';

// Configure Amplify synchronously before rendering the app
Amplify.configure(outputs.default || outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
