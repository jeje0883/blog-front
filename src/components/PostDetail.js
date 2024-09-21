// src/components/PostDetail.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem'; // Assuming you've created this component
import { UserContext } from '../context/UserContext';


const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch post and comments on mount or when postId changes
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        console.log('Fetching post and comments for postId:', postId);
        const res = await axiosInstance.get(`/posts/${postId}`);
        console.log('Fetched post data:', res.data);
        setPost(res.data);
        setComments(res.data.comments);
        setError('');
      } catch (err) {
        console.error('Error fetching post:', err.response?.data?.message || err.message);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); // Dependencies: postId

  // Handle adding a new comment
  const handleAddComment = useCallback(async (commentData) => {
    try {
      console.log(`Adding comment to post ${postId}:`, commentData);
      const res = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
      console.log('Comment added:', res.data);
      setComments((prevComments) => [...prevComments, res.data]); // Update comments state
      setShowAddCommentForm(false);
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err.response?.data?.message || err.message);
      setError('Failed to add comment.');
    }
  }, [postId]);

  // Handle editing an existing comment
  const handleEditComment = useCallback(async (commentId, updatedData) => {
    try {
      console.log('Editing comment:', commentId, updatedData);
      const res = await axiosInstance.patch(`/posts/${postId}/comments/${commentId}`, updatedData);
      console.log('Comment edited:', res.data);
      setComments((prevComments) =>
        prevComments.map((comment) => (comment._id === commentId ? res.data : comment))
      ); // Update specific comment
      setEditingComment(null);
      setError('');
    } catch (err) {
      console.error('Error editing comment:', err.response?.data?.message || err.message);
      setError('Failed to edit comment.');
    }
  }, [postId]);

  // Handle deleting a comment
  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      console.log('Deleting comment:', commentId);
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      console.log('Comment deleted');
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId)); // Remove comment
      setError('');
    } catch (err) {
      console.error('Error deleting comment:', err.response?.data?.message || err.message);
      setError('Failed to delete comment.');
    }
  }, [postId]);

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
      <p>
        <em>By {post.author || 'Unknown Author'}</em>
      </p>
      <p>{post.content}</p>
      <hr />
      <h3>Comments</h3>
      {user && (
        <button onClick={() => setShowAddCommentForm(!showAddCommentForm)} className="add-comment-button">
          {showAddCommentForm ? 'Cancel' : 'Add Comment'}
        </button>
      )}
      {showAddCommentForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowAddCommentForm(false)}
          postId={postId} // Pass postId to CommentForm
        />
      )}
      {editingComment && (
        <CommentForm
          initialData={editingComment}
          onSubmit={(data) => handleEditComment(editingComment._id, data)}
          onCancel={() => setEditingComment(null)}
          postId={postId} // Pass postId to CommentForm
        />
      )}
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <ul className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onEdit={() => setEditingComment(comment)}
                onDelete={handleDeleteComment}
                canDelete={canDeleteComment(comment)}
              />
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default PostDetail;
