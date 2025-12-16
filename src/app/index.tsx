import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * Root App component
 * Provides the router to the application
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

