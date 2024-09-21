// src/components/CommentItem.js
import React from 'react';


const CommentItem = React.memo(({ comment, onEdit, onDelete, canDelete }) => {
  return (
    <li className="comment-item">
      <p>{comment.comment}</p>
      <p className="comment-meta">
        By User {comment.commentor} on {new Date(comment.time).toLocaleString()}
      </p>
      {canDelete && (
        <div className="comment-actions">
          <button onClick={() => onEdit(comment)} className="edit-button">
            Edit
          </button>
          <button onClick={() => onDelete(comment._id)} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </li>
  );
});

export default CommentItem;
