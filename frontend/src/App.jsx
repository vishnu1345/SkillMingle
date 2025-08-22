import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import JobList from './components/Jobs';
import Test from './components/Test';
import Applications from './components/Applications';

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
    {
      path:'/jobs',
      element: <ProtectedRoute element={ <JobList/>} />
      // element: <JobList/>
    },
    {
      path: '/test/:skill',
      element: <ProtectedRoute element={<Test />} />
    },
    {
      path: '/applications',
      element: <ProtectedRoute element={<Applications/>} />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;

