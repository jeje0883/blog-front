import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


const PostItem = ({ post, onEdit, onDelete }) => {
  const { user } = useContext(UserContext);

  // Determine if the current user can edit/delete the post
  const canModify = user && (user.id === post.userID || user.isAdmin);

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="post-item">
      <h2>
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h2>
      <em>By {post.author || 'Unknown Author'} on {formattedDate}</em>
      <p>{post.content ? post.content.substring(0, 100) : 'No content available'}...</p>
      {canModify && (
        <div className="post-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              onDelete();
            }
          }}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
