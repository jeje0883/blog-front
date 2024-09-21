// src/components/PostList.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import '../styles/PostList.css'; // Import component-specific CSS

const PostList = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // For displaying filtered results
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State to track the search input
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/posts/all');
        setPosts(res.data);
        setFilteredPosts(res.data); // Initialize filteredPosts with all posts
        setError('');
      } catch (err) {
        console.error('Error fetching posts:', err.response?.data?.message || err.message);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle search input changes
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchValue)
    );
    setFilteredPosts(filtered);
  };

  // Handle adding a new post
  const handleAddPost = useCallback(async (postData) => {
    try {
      const res = await axiosInstance.post('/posts', postData);
      const newPost = res.data.savedPost;
      console.log(newPost);

      // Prepend the new post to the posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Update filteredPosts based on current searchTerm
      if (newPost.title.toLowerCase().includes(searchTerm)) {
        setFilteredPosts(prevFiltered => [newPost, ...prevFiltered]);
      }

      setShowAddPostForm(false);
      setError('');
    } catch (err) {
      console.error('Error adding post:', err.response?.data?.message || err.message);
      setError('Failed to add post.');
    }
  }, [searchTerm]);

  // Handle updating an existing post
  const handleUpdatePost = useCallback(async (postId, updatedData) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}/update`, updatedData);
      const updatedPost = res.data;

      // Update the specific post in the posts array
      setPosts(prevPosts => prevPosts.map(post => (post._id === postId ? updatedPost : post)));

      // Update filteredPosts based on current searchTerm
      setFilteredPosts(prevFiltered =>
        prevFiltered.map(post => (post._id === postId ? updatedPost : post))
      );

      setError('');
    } catch (err) {
      console.error('Error updating post:', err.response?.data?.message || err.message);
      setError('Failed to update post.');
    }
  }, []);

  // Handle deleting a post
  const handleDeletePost = useCallback(async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/delete`);

      // Remove the post from the posts array
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      // Remove the post from the filteredPosts array based on searchTerm
      setFilteredPosts(prevFiltered => prevFiltered.filter(post => post._id !== postId));

      setError('');
    } catch (err) {
      console.error('Error deleting post:', err.response?.data?.message || err.message);
      setError('Failed to delete post.');
    }
  }, []);

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h1>Blog Posts</h1>
        <span>
          {!user ? <Link to="/login">Please login to use blog features</Link> : null}
        </span>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      <div className="post-list-actions">
        {user && (
          <button onClick={() => setShowAddPostForm(!showAddPostForm)} className="add-post-button">
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

      {/* Show Add Post Form */}
      {showAddPostForm && (
        <PostForm
          onSubmit={handleAddPost}
          onCancel={() => setShowAddPostForm(false)}
        />
      )}

      {/* Loading Indicator */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="posts">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostItem
                key={post._id}
                post={post}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                searchTerm={searchTerm} // Pass searchTerm if needed
              />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
