// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


const Navbar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clear the user context
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar" sticky="top">
      <ul>
        <li>
          <Link to="/">The Exciting Blog</Link>
        </li>
        <li className='ms-auto'>

        </li>
        {user ? (
          <>
          <li >
              <span>Welcome, {user.username}</span>
            </li>
            <li>
              <Link to="/profile">Profile</Link> {/* Added Profile Link */}
            </li>
            
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
