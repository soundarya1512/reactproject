import axios from 'axios';

// Load Base URL from environment variables or use default
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== Token Management ====== //
const setAuthTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const removeAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// ====== Authentication Endpoints ====== //
export const AUTH_ENDPOINTS = {
  login: `${BASE_URL}/auth/jwt/create/`,
  refresh: `${BASE_URL}/auth/jwt/refresh/`,
  verify: `${BASE_URL}/auth/jwt/verify/`,
  user: `${BASE_URL}/auth/users/me/`,
  changePassword: `${BASE_URL}/auth/users/set_password/`,
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
    console.warn("No refresh token found, logging out...");
    removeAuthTokens();
    return null;
  }

  try {
    const response = await axios.post(AUTH_ENDPOINTS.refresh, { refresh: refreshToken });
    const newAccessToken = response.data.access;

    setAuthTokens(newAccessToken, refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
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

// ====== Password Change ====== //
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.changePassword, {
      current_password: oldPassword,
      new_password: newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Change password failed:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data || { detail: 'Password update failed' },
    };
  }
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
    const response = await apiClient.get('states/?page=${page}');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error.response?.data || error.message);
    return [];
  }
};


// export const getStates = async (page = 1) => {
//   const res = await fetch(`states/?page=${page}`);
//   if (!res.ok) throw new Error("Failed to fetch states");
//   return await res.json();
// };

// export const getCountries = async () => {
//   const res = await fetch(`https://api.pyt.goitprojects.com/countries/`);
//   if (!res.ok) throw new Error("Failed to fetch countries");
//   return await res.json();
// };

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



export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/auth/users/me/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating user profile:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data || 'Profile update failed',
    };
  }
};


///////////////start::role///////////////////////////////////


// Role APIs
// export const getRoles = async () => {
//   try {
//     const response = await apiClient.get('/ ');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching roles:', error);
//     return [];
//   }
// };


export const getRoles = async () => {
  try {
    const response = await apiClient.get('/get-roles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};




// helpers/apiHelper.js

export const createRole = async (data) => {
  try {
    // data should be { name: string, permissions: number[] }
    const response = await apiClient.post('/create-role/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', {
      status: error.response?.status,
      data:   error.response?.data
    });
    return null;
  }
};
 



export const deleteRole = async (id) => {
  try {
    await apiClient.delete(`/delete-role/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { success: false, error: error.response?.data || 'Failed to delete role' };
  }
};

// Update role API function
export const updateRole = async (id, roleData) => {
  try {
    const response = await apiClient.put(`/edit-role/${id}/`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error; // Make sure errors are thrown to be handled in the calling component
  }
};

///////////////end::role///////////////////////////////////

///////////////start::ownership///////////////////////////////////
//get ownership data
export const getOwnership = async () => {
  try {
    const response = await apiClient.get('/ownership-types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching ownership:', error);
    return [];
  }
};

//delete ownership
export const deleteOwnership = async (id) => {
  try {
    await apiClient.delete(`/delete-ownership/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting ownership:', error);
    return { success: false, error: error.response?.data || 'Failed to delete ownership' };
  }
};

// Update ownership 
export const updateOwnership = async (id, ownershipData) => {
  try {
    const response = await apiClient.put(`/edit-ownership/${id}/`, ownershipData);
    return response.data;
  } catch (error) {
    console.error('Error updating ownership:', error);
    throw error; // Make sure errors are thrown to be handled in the calling component
  }
};

///////////////end::ownership///////////////////////////////////

export const assignRoleToUser = async (userId, roleId) => {
  try {
    const response = await apiClient.post('/assign-role/', {
      user_id: userId,
      role_id: roleId
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    return null;
  }
};
/////////////////////start :: user///////////////////////////////

//get user
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

//add user
export const addUser = async (payload) => {
  try {
    const response = await apiClient.post('/users/', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

///delete user
export const deleteUser = async (id) => {
  try {
    await apiClient.delete(`/users/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error.response?.data || 'Failed to delete user',
    };
  }
};

// Update user 
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}/`, userData); // Adjust endpoint if needed
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
/////////user get data by id
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users by ID:', error);
    return null;
  }
};
/////////////////////edit :: user///////////////////////////////
// ====== Permissions API ======

export const getPermissions = async () => {
  try {
    const response = await apiClient.get('/get-permissions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};



export const assignPermissionsToRole = async (roleId, permissionIds) => {
  try {
    const response = await apiClient.post(`/roles/${roleId}/assign-permissions/`, {
      permissions: permissionIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning permissions:', error);
    return null;
  }
};


export const getRolePermissions = async (roleId) => {
  try {
    const response = await apiClient.get(`/roles/${roleId}/permissions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
};

// New API function to get a role by ID
export const getRoleById = async (id) => {
  try {
    const response = await apiClient.get(`/edit-role/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    return null;
  }
};

// apiHelper.js







// ====== Axios Interceptors ====== //
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;