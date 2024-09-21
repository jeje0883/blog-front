import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const CommentForm = ({ onSubmit, onCancel, initialData = {}, postId }) => { 
  const { user } = useContext(UserContext);
  const [comment, setComment] = useState(initialData.comment || '');
  const [error, setError] = useState('');

  console.log("initialData:", initialData);
  console.log("postId:", postId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    
    const commentData = {
      userID: user.id, 
      comment,
      commentor: user.username,
      postId, 
    };
    
    onSubmit(commentData);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form-container">
      <h4 className="comment-form-heading">{initialData._id ? 'Edit Comment' : 'Add Comment'}</h4>
      {error && <p className="comment-form-error">{error}</p>}
      <div className="comment-form-input">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          required
          placeholder="Enter your comment here..."
          className="comment-form-textarea"
        ></textarea>
      </div>
      <div className="comment-form-buttons">
        <button type="submit" className="comment-form-submit">
          {initialData._id ? 'Update' : 'Post'}
        </button>
        <button type="button" onClick={onCancel} className="comment-form-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
