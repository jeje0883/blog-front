import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PostForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form-container">
      <h3 className="post-form-heading">{initialData._id ? 'Edit Post' : 'Add New Post'}</h3>
      {error && <p className="post-form-error">{error}</p>}
      <div className="post-form-group">
        <label className="post-form-label">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="post-form-input"
        />
      </div>
      <div className="post-form-group">
        <label className="post-form-label">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          required
          className="post-form-textarea"
        ></textarea>
      </div>
      <div className="post-form-buttons">
        <button type="submit" className="post-form-submit">
          {initialData._id ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="post-form-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;
