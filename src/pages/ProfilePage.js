import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode JWT token
import { Notyf } from 'notyf'; // Import Notyf for notifications
import 'notyf/notyf.min.css'; // Import Notyf CSS

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext); // Add setUser to update user context
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

  // Initialize Notyf
  const notyf = new Notyf();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
    
      if (token && token !== 'undefined') {  // Ensure token exists
        try {
          // Decode the token
          const decoded = jwtDecode(token);
          setProfile(decoded);
          setEditForm({ username: decoded.username, email: decoded.email });
        } catch (err) {
          console.error('Error decoding token:', err);
          fetchProfile(); // Fallback to fetching if token is invalid
        }
      } else {
        fetchProfile(); // Fetch profile if no token
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/details'); // Protected route
        setProfile(res.data);
        setEditForm({ username: res.data.username, email: res.data.email });
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data?.message || error.message);
        setError(error.response?.data?.message || 'An error occurred while fetching profile.');
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Handle form input changes for Edit Profile
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle form input changes for Change Password
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Handle Profile Edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the API call to update the user profile
      const res = await axiosInstance.put('/users/profile', editForm); // API endpoint for updating user details
  
      // Ensure the new token is returned from the server
      const newToken = res.data.token; 
      console.log('New token received:', newToken);
  
      if (newToken) {
        // Store the new token in localStorage
        localStorage.setItem('token', newToken);
        console.log('Token updated in localStorage.');
  
        // Decode the new token to extract the updated user information
        const decoded = jwtDecode(newToken);
        console.log('Decoded token:', decoded);
  
        // Update the user context and profile with the new user data
        setUser(decoded);  
        setProfile(decoded);

        // Close the modal
        setShowEditModal(false);
  
        // Notify success
        notyf.success('Profile updated successfully');
      } else {
        console.error('No token returned from the server.');
        throw new Error('No token returned from the server');
      }
    } catch (error) {
      // Notify error
      notyf.error('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };
  
  // Handle Password Change form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notyf.error('Passwords do not match.');
      return;
    }

    try {
      await axiosInstance.patch('/users/update-password', { password: passwordForm.newPassword });
      notyf.success('Password changed successfully.');
      setShowPasswordModal(false); // Close the password modal after success
    } catch (error) {
      notyf.error('Error changing password.');
      console.error('Error changing password:', error);
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Admin:</strong> {profile.isAdmin ? 'Yes' : 'No'}</p>
      
      {/* Edit Profile Button */}
      {user.username==='admin' ? (
        <button disabled onClick={() => setShowEditModal(true)} className="btn-disabled">
          Disabled for default admin
        </button>
      ) : (

        <button onClick={() => setShowEditModal(true)} className="btn-enabled">
          Edit Details
        </button>
      )}

      {/* Change Password Button */}
      {user.username==='admin'  ? (
          <button disabled onClick={() => setShowPasswordModal(true)} className="btn-disabled">
            Disabled for default admin
          </button>
        ) : (
          <button onClick={() => setShowPasswordModal(true)} className="btn-enabled">
          Change Password
          </button>
)}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={editForm.username} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              {/* <div>
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editForm.email} 
                  onChange={handleEditChange} 
                  required 
                />
              </div> */}
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div>
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              <div>
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordForm.confirmPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              <button type="submit">Change Password</button>
              <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
