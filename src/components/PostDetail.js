import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CommentForm from './CommentForm';
import { UserContext } from '../context/UserContext';


const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState('');

  // Fetch post and comments on mount
  useEffect(() => {
    console.log('Fetching post and comments for postId:', postId);
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get(`/posts/${postId}`);
      console.log('Fetched post data:', res.data);
      setPost(res.data);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Error fetching post:', err.response?.data?.message || err.message);
      setError('Failed to load post.');
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      console.log(`Adding comment to post ${postId}:`, commentData);
      const res = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
      console.log('Comment added:', res.data);
      setComments([...comments, res.data]);
      setShowAddCommentForm(false);
      fetchPost();
    } catch (err) {
      console.error('Error adding comment:', err.response?.data?.message || err.message);
      setError('Failed to add comment.');
    }
  };

  const handleEditComment = async (commentId, updatedData) => {
    try {
      console.log('Editing comment:', commentId, updatedData);
      const res = await axiosInstance.patch(`/posts/${postId}/comments/${commentId}`, updatedData);
      console.log('Comment edited:', res.data);
      setComments(comments.map(comment => (comment._id === commentId ? res.data : comment)));
      setEditingComment(null);
      fetchPost();
    } catch (err) {
      console.error('Error editing comment:', err.response?.data?.message || err.message);
      setError('Failed to edit comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log('Deleting comment:', commentId);
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      console.log('Comment deleted');
      setComments(comments.filter(comment => comment._id !== commentId));
      fetchPost();
    } catch (err) {
      console.error('Error deleting comment:', err.response?.data?.message || err.message);
      setError('Failed to delete comment.');
    }
  };

  if (error) {
    console.log('Error state:', error);
    return <p className="error-message">{error}</p>;
  }

  if (!post) {
    console.log('Loading post...');
    return <p>Loading post...</p>;
  }

  // Determine if the user can delete comments (own or admin)
  const canDeleteComment = (comment) => {
    return user && (user.id === comment.userID || user.isAdmin);
  };

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <p><em>By {post.author || 'Unknown Author'}</em></p>
      <p>{post.content}</p>
      <hr />
      <h3>Comments</h3>
      {error && <p className="error-message">{error}</p>}
      {user && (
        <button onClick={() => setShowAddCommentForm(!showAddCommentForm)}>
          {showAddCommentForm ? 'Cancel' : 'Add Comment'}
        </button>
      )}
      {showAddCommentForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowAddCommentForm(false)}
          postId={postId}  // Pass postId to CommentForm
        />
      )}
      {editingComment && (
        <CommentForm
          initialData={editingComment}
          onSubmit={(data) => handleEditComment(editingComment._id, data)}
          onCancel={() => setEditingComment(null)}
          postId={postId}  // Pass postId to CommentForm
        />
      )}
      <ul className="comments-list">
        {comments.map(comment => (
          <li key={comment._id} className="comment-item">
            <p>{comment.comment}</p>
            <p className="comment-meta">
              By User {comment.commentor} on {new Date(comment.time).toLocaleString()}
            </p>
            {canDeleteComment(comment) && (
              <div className="comment-actions">
                <button onClick={() => setEditingComment(comment)}>Edit</button>
                <button onClick={() => {
                  if (window.confirm('Are you sure you want to delete this comment?')) {
                    handleDeleteComment(comment._id);
                  }
                }}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
