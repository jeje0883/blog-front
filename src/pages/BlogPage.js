// src/pages/HomePage.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const BlogPage = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <h2>Welcome to the Home Page, {user.username}!</h2>
      ) : (
        <h2>Welcome to the Home Page! Please log in.</h2>
      )}
    </div>
  );
};

export default BlogPage;
