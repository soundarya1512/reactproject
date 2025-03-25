import axios from 'axios';

// Load Base URL from environment variables or use default
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://44.199.13.54';


// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== Token Management ====== //
// Store tokens in localStorage
const setAuthTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

// Remove tokens from localStorage
const removeAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Get stored tokens
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// ====== Authentication Endpoints ====== //
export const AUTH_ENDPOINTS = {
  login: `${BASE_URL}/auth/jwt/create/`,
  refresh: `${BASE_URL}/auth/jwt/refresh/`,
  verify: `${BASE_URL}/auth/jwt/verify/`,
  user: `${BASE_URL}/auth/users/me/`,
};

// ====== Authentication Functions ====== //
// Check if user is authenticated
export const isAuthenticated = async () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // Verify token validity
    await axios.post(AUTH_ENDPOINTS.verify, { token });
    return true;
  } catch (error) {
    console.warn("Token expired, attempting refresh...");
    return !!(await refreshAccessToken());
  }
};

// Refresh Access Token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("No refresh token found, cannot refresh access token.");
    return null;
  }

  try {
    console.log("Attempting to refresh token with:", refreshToken);
    const response = await axios.post(AUTH_ENDPOINTS.refresh, { refresh: refreshToken });
    console.log("New Access Token:", response.data.access);

    setAuthTokens(response.data.access, refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error.response?.data || error);
    removeAuthTokens(); // Clear invalid tokens
    return null;
  }
};


// Login Function (Superuser Only)
// Login Function (Allow All Users)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.login, { email, password });
    const { access, refresh } = response.data;

    // Fetch user details
    const userResponse = await axios.get(AUTH_ENDPOINTS.user, {
      headers: { Authorization: `Bearer ${access}` },
    });

    console.log('User Response:', userResponse.data);

    const user = userResponse.data;

    // Set tokens in local storage
    setAuthTokens(access, refresh);

    return { success: true, data: user };
  } catch (error) {
    console.error('Login Error:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Login failed' };
  }
};


// Fetch User Profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(AUTH_ENDPOINTS.user);
    return response.data; // Returns full user data (including first_name & email)
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null; // Return null if there's an error
  }
};

// Logout Function
export const logoutUser = () => {
  removeAuthTokens();
  window.location.replace('/login'); // Redirect to login instead of reload
};

// ====== Master Table API Functions ====== //
// Fetch Country List
export const getCountries = async () => {
  try {
    console.log("Fetching countries...");  // Debugging
    console.log("Token:", localStorage.getItem("access_token"));  // Debugging token

    const response = await apiClient.get('/countries/');
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.response?.data || error.message);
    return [];
  }
};


// Fetch State List
export const getStates = async () => {
  try {
    const response = await apiClient.get('/states/');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error.response?.data || error.message);
    return [];
  }
};

// Fetch City List
export const getCities = async () => {
  try {
    const response = await apiClient.get('/cities/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error.response?.data || error.message);
    return [];
  }
};

// Fetch Property List
export const getProperties = async () => {
  try {
    const response = await apiClient.get('/properties/');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data || error.message);
    return [];
  }
};

// ====== Axios Interceptor for Auto Token Refresh ====== //
apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request Headers:", config.headers); // Debugging
    } else {
      console.warn("No token found, request might fail.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default apiClient;
