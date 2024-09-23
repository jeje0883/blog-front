// src/components/CommentForm.js
import React, { useState } from 'react';
import '../styles/CommentForm.css'; // Import component-specific CSS

const CommentForm = ({ onSubmit, onCancel, initialData = {}, isEditing = false }) => {
  const [comment, setComment] = useState(initialData.comment || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    const commentData = { comment };
    onSubmit(commentData);
  };

  return (
    <div className="comment-form-container">
      <h4>{isEditing ? 'Edit Comment' : 'Add New Comment'}</h4>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
            rows="4"
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {isEditing ? 'Update Comment' : 'Add Comment'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
