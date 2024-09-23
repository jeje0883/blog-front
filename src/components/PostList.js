
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Button, Form, InputGroup,Pagination } from 'react-bootstrap'; 
import '../styles/PostList.css'; 
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // State variables for sorting and pagination
  const [isTrending, setIsTrending] = useState(false);
  const [isDateSorted, setIsDateSorted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  // State variables for filtering
  const [isMyPosts, setIsMyPosts] = useState(false);
  const [isMyComments, setIsMyComments] = useState(false);

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/posts/all');
        setPosts(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching posts:', err.response?.data?.message || err.message);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Compute filtered posts based on search term and filters
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (isMyPosts && user) {
      filtered = filtered.filter((post) => post.userID === user.id);
    }

    if (isMyComments && user) {
      filtered = filtered.filter((post) =>
        post.comments?.some((comment) => comment.userID === user.id)
      );
    }

    return filtered;
  }, [posts, searchTerm, isMyPosts, isMyComments, user]);

  // Compute sorted posts based on sorting options
  const sortedPosts = useMemo(() => {
    let sorted = [...filteredPosts];

    if (isTrending) {
      sorted.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else if (isDateSorted) {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [filteredPosts, isTrending, isDateSorted]);

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Handlers for various actions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortTrending = () => {
    setIsTrending(true);
    setIsDateSorted(false);
    setCurrentPage(1);
  };

  const handleResetSort = () => {
    setIsTrending(false);
    setCurrentPage(1);
  };

  const handleSortByDate = () => {
    setIsDateSorted(true);
    setIsTrending(false);
    setCurrentPage(1);
  };

  const handleResetDateSort = () => {
    setIsDateSorted(false);
    setCurrentPage(1);
  };

  const handlePostsPerPageChange = (e) => {
    setPostsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleToggleMyPosts = () => {
    setIsMyPosts(!isMyPosts);
    if (!isMyPosts) {
      setIsMyComments(false);
    }
    setCurrentPage(1);
  };

  const handleToggleMyComments = () => {
    setIsMyComments(!isMyComments);
    if (!isMyComments) {
      setIsMyPosts(false);
    }
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddPost = useCallback(
    async (postData) => {
      try {
        const res = await axiosInstance.post('/posts', postData);
        const newPost = res.data.savedPost;

        // Prepend the new post to the posts array
        setPosts((prevPosts) => [newPost, ...prevPosts]);

        setShowAddPostForm(false);
        setError('');
      } catch (err) {
        console.error('Error adding post:', err.response?.data?.message || err.message);
        setError('Failed to add post.');
      }
    },
    []
  );

  const handleUpdatePost = useCallback(async (postId, updatedData) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}/update`, updatedData);
      const updatedPost = res.data;

      setPosts((prevPosts) => prevPosts.map((post) => (post._id === postId ? updatedPost : post)));

      setError('');
    } catch (err) {
      console.error('Error updating post:', err.response?.data?.message || err.message);
      setError('Failed to update post.');
    }
  }, []);

  const handleDeletePost = useCallback(async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/delete`);

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      setError('');
    } catch (err) {
      console.error('Error deleting post:', err.response?.data?.message || err.message);
      setError('Failed to delete post.');
    }
  }, []);

  return (
    <div className="container">
      <div className="mt-3">
        <h1 className="h4">Blog Posts</h1>
        {!user && <Link to="/login">Please login to use blog features</Link>}
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex flex-wrap align-items-center my-3">
        {user && (
          <Button
            variant="primary"
            size="sm"
            className="me-2 mb-2"
            onClick={() => setShowAddPostForm(!showAddPostForm)}
          >
            {showAddPostForm ? 'Cancel' : 'Add New Post'}
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="me-2 mb-2"
          onClick={isTrending ? handleResetSort : handleSortTrending}
        >
          {isTrending ? 'Reset' : 'Trending'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="me-2 mb-2"
          onClick={isDateSorted ? handleResetDateSort : handleSortByDate}
        >
          {isDateSorted ? 'Reset' : 'Sort by Date'}
        </Button>

        {user && (
          <>
            <Button
              variant={isMyPosts ? 'warning' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2"
              onClick={handleToggleMyPosts}
            >
              {isMyPosts ? 'Show All Posts' : 'My Posts'}
            </Button>

            <Button
              variant={isMyComments ? 'warning' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2"
              onClick={handleToggleMyComments}
            >
              {isMyComments ? 'Show All Posts' : 'My Comments'}
            </Button>
          </>
        )}

        <InputGroup size="sm" className="mb-2 ms-auto" style={{ maxWidth: '300px' }}>
          <Form.Control
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="d-flex justify-content-end align-items-center mb-2">
        <Form.Label className="me-2 mb-0">Posts per page:</Form.Label>
        <Form.Select
          size="sm"
          value={postsPerPage}
          onChange={handlePostsPerPageChange}
          style={{ width: 'auto' }}
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={100}>100</option>
        </Form.Select>
      </div>

      {showAddPostForm && (
        <PostForm onSubmit={handleAddPost} onCancel={() => setShowAddPostForm(false)} />
      )}

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          <div className="posts">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                />
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination size="sm">
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />
              <Pagination.Item active>{`Page ${currentPage} of ${totalPages}`}</Pagination.Item>
              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
