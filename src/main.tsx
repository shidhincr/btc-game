import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from '@/app';

(async () => {
  try {
    // @ts-expect-error - amplify_outputs.json may not exist until sandbox is run
    const outputs = await import('../amplify_outputs.json');
    Amplify.configure(outputs.default || outputs);
  } catch (error) {
    console.warn(
      'amplify_outputs.json not found. Make sure to run `npx ampx sandbox` to generate it.',
      error
    );
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
