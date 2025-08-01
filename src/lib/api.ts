import axios from 'axios';

// Create a new instance of axios
const api = axios.create({
  // Optional: Set a base URL for all API requests
  baseURL: '/api',

  // --- THIS IS THE MOST IMPORTANT PART ---
  // This tells axios to include cookies (like your `session_token`) in every request.
  withCredentials: true,
});

/**
 * We can also add a response interceptor to handle errors globally.
 * This is great for handling expired tokens. If any API call returns a 401,
 * it will automatically redirect the user to the login page.
 */
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Don't redirect for the login page itself, to avoid a redirect loop
      if (window.location.pathname !== '/login') {
        console.warn("Unauthorized request. Redirecting to login.");
        // Redirect to the login page
        window.location.href = '/login';
      }
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);


export { api };