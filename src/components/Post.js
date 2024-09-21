// src/components/Post.js
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import CommentForm from './CommentForm';

const Post = ({ post, onEdit, refreshPosts }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState('');

  const handleAddComment = async (commentData) => {
    try {
      const res = await axiosInstance.post(`/posts/${post._id}/comments`, commentData);
      setComments([...comments, res.data]);
      setShowAddCommentForm(false);
    } catch (err) {
      console.error('Error adding comment:', err.response?.data?.message || err.message);
      setError('Failed to add comment.');
    }
  };

  const handleEditComment = async (commentId, updatedData) => {
    try {
      const res = await axiosInstance.put(`/posts/${post._id}/comments/${commentId}`, updatedData);
      setComments(comments.map(comment => (comment._id === commentId ? res.data : comment)));
      setEditingComment(null);
    } catch (err) {
      console.error('Error editing comment:', err.response?.data?.message || err.message);
      setError('Failed to edit comment.');
    }
  };

  return (
    <div className="post-container">
      <h2>{post.title}</h2>
      <p><em>By {post.author || 'Unknown Author'}</em></p>
      <p>{post.content}</p>
      <button onClick={onEdit}>Edit Post</button>
      <hr />
      <h3>Comments</h3>
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => setShowAddCommentForm(!showAddCommentForm)}>
        {showAddCommentForm ? 'Cancel' : 'Add Comment'}
      </button>
      {showAddCommentForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowAddCommentForm(false)}
        />
      )}
      {editingComment && (
        <CommentForm
          initialData={editingComment}
          onSubmit={(data) => handleEditComment(editingComment._id, data)}
          onCancel={() => setEditingComment(null)}
        />
      )}
      <ul className="comments-list">
        {comments.map(comment => (
          <li key={comment._id} className="comment-item">
            <p>{comment.comment}</p>
            <p className="comment-meta">
              By User {comment.userID} on {new Date(comment.time).toLocaleString()}
            </p>
            <button onClick={() => setEditingComment(comment)}>Edit Comment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
