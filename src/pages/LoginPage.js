// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Import the Axios instance
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, user } = useContext(UserContext); // Access loginUser from UserContext
  const navigate = useNavigate();
  const [error, setError] = useState('');



  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home page if user is logged in
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading
    try {
      const res = await axiosInstance.post('/users/login', { email, password });
      loginUser(res.data.access);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'An error occurred during login.');
      toast.error(error.response?.data?.message || 'An error occurred during login.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
