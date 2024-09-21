// client/src/pages/RegisterPage.js
import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance'; // Ensure correct path
import { useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import the CSS for Notyf

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const notyf = new Notyf();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(''); // Clear any previous error messages
  
    // Basic client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      // API call to register the user
      const res = await axiosInstance.post('/users/register', { 
        username, 
        email, 
        password, 
        confirmPassword 
      });
  
      // Check if the response message is "Registered Successfully"
      if (res.data.message === "Registered Successfully") {
        notyf.success('Registration successful! Redirecting to login...');
        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        setError('Unexpected response from the server.');
        console.error('Unexpected success response:', res.data);
      }
  
    } catch (error) {
      // Check if the error has a response from the server
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message;
        
        // Specific handling of error responses from the backend
        switch (error.response.status) {
          case 400:
            setError(errorMessage || 'Bad request. Please check your input.');
            break;
          case 409:
            setError(errorMessage || 'This email is already registered.');
            break;
          default:
            setError(errorMessage || 'An error occurred. Please try again.');
            break;
        }
      } else if (error.request) {
        // No response was received from the server
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else went wrong during the request setup
        setError(error.message || 'An unexpected error occurred.');
      }
  
      // Log the error for debugging purposes
      console.error('Error registering:', error);
    }
  };
  
  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegisterPage;
