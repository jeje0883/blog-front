import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const PostList = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // For displaying filtered results
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State to track the search input

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts and set them in both state and filtered state
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/posts/all');
      setPosts(res.data);
      setFilteredPosts(res.data); // Initialize filteredPosts with all posts
    } catch (err) {
      console.error('Error fetching posts:', err.response?.data?.message || err.message);
      setError('Failed to load posts.');
    }
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchValue)
    );
    setFilteredPosts(filtered);
  };

  const handleAddPost = async (postData) => {
    try {
      const res = await axiosInstance.post('/posts', postData);
      setPosts([res.data, ...posts]);
      setFilteredPosts([res.data, ...filteredPosts]); // Update filtered posts
      setShowAddPostForm(false);
      fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err.response?.data?.message || err.message);
      setError('Failed to add post.');
    }
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}/update`, updatedData);
      const updatedPosts = posts.map(post => (post._id === postId ? res.data : post));
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts); // Update filtered posts
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error('Error editing post:', err.response?.data?.message || err.message);
      setError('Failed to edit post.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/delete`);
      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts); // Update filtered posts
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err.response?.data?.message || err.message);
      setError('Failed to delete post.');
    }
  };

  return (
    <div className="post-list-container">
      <div><h1>Blog Posts </h1> <span>{!user ? <Link to="/login">Please login to use blog features</Link> : null}</span></div>
      
      {error && <p className="error-message">{error}</p>}
  
      <div className="post-list-actions">
        {user && (
          <button onClick={() => setShowAddPostForm(!showAddPostForm)}>
            {showAddPostForm ? 'Cancel' : 'Add New Post'}
          </button>
        )}
  
        {/* Search Input for filtering posts */}
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchTerm}
          onChange={handleSearch}
          className="post-search-input"
        />
      </div>
  
      {showAddPostForm && (
        <PostForm
          onSubmit={handleAddPost}
          onCancel={() => setShowAddPostForm(false)}
        />
      )}
  
      <div className="posts">
        {filteredPosts.map(post => (
          <PostItem
            key={post._id}
            post={post}
            onEdit={() => setEditingPost(post)}
            onDelete={() => handleDeletePost(post._id)}
          />
        ))}
      </div>
    </div>
  );
  
};

export default PostList;
