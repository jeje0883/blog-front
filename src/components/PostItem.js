// src/components/PostItem.js
import React, { useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PostForm from './PostForm';
import { UserContext } from '../context/UserContext';
import '../styles/PostItem.css'; // Import component-specific CSS

const PostItem = ({ post, onUpdatePost, onDeletePost }) => {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Determine if the current user can edit/delete the post
  const canModify = user && (user.id === post.userID || user.isAdmin);

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  // Handler for updating the post
  const handleUpdate = useCallback(async (updatedData) => {
    try {
      await onUpdatePost(post._id, updatedData);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error in PostItem handleUpdate:', err);
      setError('Failed to update post.');
    }
  }, [onUpdatePost, post._id]);

  // Handler for deleting the post
  const handleDelete = useCallback(async () => {
    try {
      await onDeletePost(post._id);
      setError('');
    } catch (err) {
      console.error('Error in PostItem handleDelete:', err);
      setError('Failed to delete post.');
    }
  }, [onDeletePost, post._id]);

  return (
    <div className="post-item">
      {isEditing ? (
        <PostForm
          initialData={post}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      ) : (
        <>
          <h2>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h2>
          <em>By {post.author || 'Unknown Author'} on {formattedDate}</em>
          <p>{post.content ? post.content.substring(0, 100) : 'No content available'}...</p>
          {canModify && (
            <div className="post-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </div>
  );
};

export default PostItem;
