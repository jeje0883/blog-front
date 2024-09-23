// // src/components/PostDetail.js
// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import CommentForm from './CommentForm';
// import CommentItem from './CommentItem'; // Assuming you've created this component
// import { UserContext } from '../context/UserContext';


// const PostDetail = () => {
//   const { postId } = useParams();
//   const { user } = useContext(UserContext);
//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [showAddCommentForm, setShowAddCommentForm] = useState(false);
//   const [editingComment, setEditingComment] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false); // Loading state

//     // Format date and time
//     const formattedDate = new Date(post.createdAt).toLocaleDateString();
//     const formattedTime = new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


//   // Fetch post and comments on mount or when postId changes
//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       try {
//         console.log('Fetching post and comments for postId:', postId);
//         const res = await axiosInstance.get(`/posts/${postId}`);
//         console.log('Fetched post data:', res.data);

//         // Sort comments by time in descending order (latest first)
//         const sortedComments = res.data.comments.sort((a, b) => new Date(b.time) - new Date(a.time));

//         setPost(res.data);
//         setComments(sortedComments);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching post:', err.response?.data?.message || err.message);
//         setError('Failed to load post.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]); // Dependencies: postId

//   // Handle adding a new comment
//   const handleAddComment = useCallback(async (commentData) => {
//     try {
//       console.log(`Adding comment to post ${postId}:`, commentData);
//       const res = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
//       console.log('Comment added:', res.data);
//       setComments(res.data.comments); 
//       // setComments((prevComments) => [res.data, ...prevComments]); // Prepend new comment
//       setShowAddCommentForm(false);
//       setError('');
//     } catch (err) {
//       console.error('Error adding comment:', err.response?.data?.message || err.message);
//       setError('Failed to add comment.');
//     }
//   }, [postId]);

//   // Handle editing an existing comment
//   const handleEditComment = useCallback(async (commentId, updatedData) => {
//     try {
//       console.log('Editing comment:', commentId, updatedData);
//       const res = await axiosInstance.patch(`/posts/${postId}/comments/${commentId}`, updatedData);
//       console.log('Comment edited:', res.data);
//       setComments((prevComments) =>
//         prevComments.map((comment) => (comment._id === commentId ? res.data : comment))
//       ); // Update specific comment
//       setEditingComment(null);
//       setError('');
//     } catch (err) {
//       console.error('Error editing comment:', err.response?.data?.message || err.message);
//       setError('Failed to edit comment.');
//     }
//   }, [postId]);

//   // Handle deleting a comment
//   const handleDeleteComment = useCallback(async (commentId) => {
//     try {
//       console.log('Deleting comment:', commentId);
//       await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
//       console.log('Comment deleted');
//       setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId)); // Remove comment
//       setError('');
//     } catch (err) {
//       console.error('Error deleting comment:', err.response?.data?.message || err.message);
//       setError('Failed to delete comment.');
//     }
//   }, [postId]);

//   if (error) {
//     console.log('Error state:', error);
//     return <p className="error-message">{error}</p>;
//   }

//   if (!post) {
//     console.log('Loading post...');
//     return <p>Loading post...</p>;
//   }

//   // Determine if the user can delete comments (own or admin)
//   const canDeleteComment = (comment) => {
//     return user && (user.id === comment.userID || user.isAdmin);
//   };

//   return (
//     <div className="post-detail-container">
//       <h1>{post.title}</h1>
//       <p>
//         <em>By {post.author || 'Unknown Author'} on {formattedDate} at {formattedTime}</em>
//       </p>
//       <p>{post.content}</p>
//       <hr />
//       <h3>Comments</h3>
//       {user && (
//         <button onClick={() => setShowAddCommentForm(!showAddCommentForm)} className="add-comment-button">
//           {showAddCommentForm ? 'Cancel' : 'Add Comment'}
//         </button>
//       )}
//       {showAddCommentForm && (
//         <CommentForm
//           onSubmit={handleAddComment}
//           onCancel={() => setShowAddCommentForm(false)}
//           postId={postId} // Pass postId to CommentForm
//         />
//       )}
//       {editingComment && (
//         <CommentForm
//           initialData={editingComment}
//           onSubmit={(data) => handleEditComment(editingComment._id, data)}
//           onCancel={() => setEditingComment(null)}
//           postId={postId} // Pass postId to CommentForm
//         />
//       )}
//       {loading ? (
//         <p>Loading comments...</p>
//       ) : (
//         <ul className="comments-list">
//           {comments.length > 0 ? (
//             comments.map((comment) => (
//               <CommentItem
//                 key={comment._id}
//                 comment={comment}
//                 onEdit={() => setEditingComment(comment)}
//                 onDelete={handleDeleteComment}
//                 canDelete={canDeleteComment(comment)}
//               />
//             ))
//           ) : (
//             <p>No comments yet.</p>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default PostDetail;





// src/components/PostDetail.js// src/components/PostDetail.js
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem'; // Ensure this component exists
import { UserContext } from '../context/UserContext';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch post and all posts on mount or when postId changes
  useEffect(() => {
    const fetchPostAndAllPosts = async () => {
      setLoading(true);
      try {
        const [postRes, allPostsRes] = await Promise.all([
          axiosInstance.get(`/posts/${postId}`),
          axiosInstance.get('/posts/all'),
        ]);

        // Sort comments by time in descending order (latest first)
        const sortedComments = postRes.data.comments.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setPost(postRes.data);
        setComments(sortedComments);

        // Sort allPosts by createdAt in descending order
        const sortedPosts = allPostsRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllPosts(sortedPosts);

        setError('');
      } catch (err) {
        console.error('Error fetching post:', err.response?.data?.message || err.message);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndAllPosts();
  }, [postId]);

  // Determine previous and next posts
  const { previousPost, nextPost } = useMemo(() => {
    const currentIndex = allPosts.findIndex((p) => p._id === postId);
    const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    return { previousPost, nextPost };
  }, [allPosts, postId]);

  // Handlers for adding, editing, and deleting comments
  const handleAddComment = useCallback(
    async (commentData) => {
      try {
        const res = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
        setComments(res.data.comments);
        setShowAddCommentForm(false);
        setError('');
      } catch (err) {
        console.error('Error adding comment:', err.response?.data?.message || err.message);
        setError('Failed to add comment.');
      }
    },
    [postId]
  );

  const handleEditComment = useCallback(
    async (commentId, updatedData) => {
      try {
        const res = await axiosInstance.patch(
          `/posts/${postId}/comments/${commentId}`,
          updatedData
        );
        setComments((prevComments) =>
          prevComments.map((comment) => (comment._id === commentId ? res.data : comment))
        );
        setEditingComment(null);
        setError('');
      } catch (err) {
        console.error('Error editing comment:', err.response?.data?.message || err.message);
        setError('Failed to edit comment.');
      }
    },
    [postId]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
        setError('');
      } catch (err) {
        console.error('Error deleting comment:', err.response?.data?.message || err.message);
        setError('Failed to delete comment.');
      }
    },
    [postId]
  );

  // Determine if the user can delete comments (own or admin)
  const canDeleteComment = (comment) => {
    return user && (user.id === comment.userID || user.isAdmin);
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!post) {
    return <p>Loading post...</p>;
  }

  // Format date and time
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  const formattedTime = new Date(post.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between my-3">
        {previousPost ? (
          <Link to={`/posts/${previousPost._id}`} className="btn btn-link p-0">
            <FaArrowLeft size={24} />
          </Link>
        ) : (
          <div style={{ width: 24 }}></div>
        )}

        <h1 className="h4 text-center mb-0">{post.title}</h1>

        {nextPost ? (
          <Link to={`/posts/${nextPost._id}`} className="btn btn-link p-0">
            <FaArrowRight size={24} />
          </Link>
        ) : (
          <div style={{ width: 24 }}></div>
        )}
      </div>

      <p className="text-muted">
        <em>
          By {post.author || 'Unknown Author'} on {formattedDate} at {formattedTime}
        </em>
      </p>
      <p>{post.content}</p>
      <hr />
      <h5>Comments</h5>
      {user && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddCommentForm(!showAddCommentForm)}
          className="mb-3"
        >
          {showAddCommentForm ? 'Cancel' : 'Add Comment'}
        </Button>
      )}
      {showAddCommentForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowAddCommentForm(false)}
          postId={postId}
        />
      )}
      {editingComment && (
        <CommentForm
          initialData={editingComment}
          onSubmit={(data) => handleEditComment(editingComment._id, data)}
          onCancel={() => setEditingComment(null)}
          postId={postId}
        />
      )}
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <ul className="list-unstyled">
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
