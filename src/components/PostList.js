// src/components/PostList.js
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
  const handleAddPost = async (postData) => {
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
  };

  // Handle editing an existing post
  const handleEditPost = async (postId, updatedData) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}/update`, updatedData);
      const updatedPost = res.data;

      // Update the specific post in the posts array
      setPosts(prevPosts => prevPosts.map(post => (post._id === postId ? updatedPost : post)));

      // Update filteredPosts based on current searchTerm
      if (searchTerm) {
        setFilteredPosts(prevFiltered =>
          prevFiltered.map(post => (post._id === postId ? updatedPost : post))
        );
      } else {
        setFilteredPosts(prevFiltered =>
          prevFiltered.map(post => (post._id === postId ? updatedPost : post))
        );
      }

      setEditingPost(null);
      setError('');
    } catch (err) {
      console.error('Error editing post:', err.response?.data?.message || err.message);
      setError('Failed to edit post.');
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/delete`);

      // Remove the post from the posts array
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      // Remove the post from the filteredPosts array based on searchTerm
      if (searchTerm) {
        setFilteredPosts(prevFiltered => prevFiltered.filter(post => post._id !== postId));
      } else {
        setFilteredPosts(prevFiltered => prevFiltered.filter(post => post._id !== postId));
      }

      setError('');
    } catch (err) {
      console.error('Error deleting post:', err.response?.data?.message || err.message);
      setError('Failed to delete post.');
    }
  };

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
        {user && !editingPost && (
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

      {/* Show Add Post Form only if not editing */}
      {showAddPostForm && !editingPost && (
        <PostForm
          onSubmit={handleAddPost}
          onCancel={() => setShowAddPostForm(false)}
        />
      )}

      {/* Show Edit Post Form */}
      {editingPost && (
        <PostForm
          initialData={editingPost}
          onSubmit={(updatedData) => handleEditPost(editingPost._id, updatedData)}
          onCancel={() => setEditingPost(null)}
          isEditing={true}
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
                onEdit={() => setEditingPost(post)}
                onDelete={() => handleDeletePost(post._id)}
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
