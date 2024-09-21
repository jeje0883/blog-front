// src/components/CommentItem.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/CommentItem.css'; // Import component-specific CSS

const CommentItem = ({ comment, onEdit, onDelete, canDelete }) => {
  const { user } = useContext(UserContext);

  const formattedDate = new Date(comment.time).toLocaleString();

  return (
    <li className="comment-item">
      <p>{comment.comment}</p>
      <p className="comment-meta">
        By User {comment.commentor} on {formattedDate}
      </p>
      {canDelete && (
        <div className="comment-actions">
          <button onClick={onEdit} className="edit-button">Edit</button>
          <button onClick={onDelete} className="delete-button">Delete</button>
        </div>
      )}
    </li>
  );
};

export default CommentItem;
