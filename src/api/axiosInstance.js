import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`, // Ensure this matches your backend's base URL and port
  // baseURL: `http://localhost:4000`, // Ensure this matches your backend's base URL and port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Corrected: Retrieving token directly from 'token' key

    console.log("Token from localStorage:", token); // Debugging: Log the token

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers['Authorization']); // Debugging: Confirm the Authorization header
    } else {
      console.log("No token found, Authorization header not set."); // Debugging: Log when no token is found
    }

    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error); // Debugging: Log any errors in the interceptor
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Session expired, redirecting to login."); // Debugging: Log 401 errors
        // Optionally, display a notification
        // toast.error('Session expired. Please log in again.');
        // Redirect to login
        window.location.href = '/login';
      }
      // Handle other status codes as needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
