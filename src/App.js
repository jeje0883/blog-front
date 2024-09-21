
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserProvider from './context/UserContext';
import PostDetail from './components/PostDetail';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage'; // Assume you have a login page
import RegisterPage from './pages/RegisterPage'; // Assume you have a signup page
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';  
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  return (
    <UserProvider>
    
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
