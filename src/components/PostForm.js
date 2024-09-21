// src/components/PostForm.js
import React, { useState } from 'react';

const PostForm = ({ onSubmit, onCancel, initialData = {}, isEditing = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    const postData = { title, content };
    onSubmit(postData);
  };

  return (
    <div className="post-form-container">
      <h2>{isEditing ? 'Edit Post' : 'Add New Post'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update Post' : 'Add Post'}</button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
