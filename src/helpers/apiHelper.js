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
export const isAuthenticated = async () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    await axios.post(AUTH_ENDPOINTS.verify, { token });
    return true;
  } catch (error) {
    console.warn("Token expired, attempting refresh...");
    return !!(await refreshAccessToken());
  }
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("No refresh token found, cannot refresh access token.");
    return null;
  }

  try {
    const response = await axios.post(AUTH_ENDPOINTS.refresh, { refresh: refreshToken });
    setAuthTokens(response.data.access, refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error.response?.data || error);
    removeAuthTokens();
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.login, { email, password });
    const { access, refresh } = response.data;
    const userResponse = await axios.get(AUTH_ENDPOINTS.user, {
      headers: { Authorization: `Bearer ${access}` },
    });
    setAuthTokens(access, refresh);
    return { success: true, data: userResponse.data };
  } catch (error) {
    console.error('Login Error:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Login failed' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(AUTH_ENDPOINTS.user);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const logoutUser = () => {
  removeAuthTokens();
  window.location.replace('/login');
};

// ====== Master Table API Functions ====== //
export const getCountries = async () => {
  try {
    const response = await apiClient.get('/countries/');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.response?.data || error.message);
    return [];
  }
};

export const getStates = async () => {
  try {
    const response = await apiClient.get('/states/');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error.response?.data || error.message);
    return [];
  }
};

export const getCities = async () => {
  try {
    const response = await apiClient.get('/cities/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error.response?.data || error.message);
    return [];
  }
};

export const getProperties = async () => {
  try {
    const response = await apiClient.get('/properties/');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data || error.message);
    return [];
  }
};

export const addProperty = async (propertyData) => {
  try {
    const response = await apiClient.post('/properties/', propertyData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to add property' };
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await apiClient.put(`/properties/${id}/`, propertyData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to update property' };
  }
};

export const deleteProperty = async (id) => {
  try {
    await apiClient.delete(`/properties/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to delete property' };
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
