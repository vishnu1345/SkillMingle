import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/home',
      element: <ProtectedRoute element={<Home />} />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
