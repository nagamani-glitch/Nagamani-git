import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// Create API instance
const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token and company code in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    
    console.log('Request config before adding headers:', {
      url: config.url,
      method: config.method,
      headers: { ...config.headers }
    });
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No token found in localStorage');
      }
      
      if (companyCode) {
        config.headers['X-Company-Code'] = companyCode;
      } else {
        console.warn('No company code found in localStorage');
      }
      
      console.log('Request config after adding headers:', {
        url: config.url,
        method: config.method,
        headers: { 
          Authorization: token ? `Bearer ${token.substring(0, 10)}...` : 'none',
          'X-Company-Code': companyCode || 'none'
        }
      });
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config.url,
          method: error.config.method
        });
        
        // Handle token expiration
        if (error.response.status === 401) {
          console.error('Authentication error - token might be expired or invalid');
          
          // You might want to redirect to login or refresh the token here
          // For example:
          // window.location.href = '/login';
        }
      } else if (error.request) {
        console.error('API Request Error (No Response):', error.request);
      } else {
        console.error('API Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
  
  // Async thunks
  export const fetchUsers = createAsyncThunk(
    'userManagement/fetchUsers',
    async (_, { rejectWithValue }) => {
      try {
        console.log('Fetching users...');
        const response = await api.get('/roles/users');
        console.log('Users fetched successfully:', response.data.length);
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
      }
    }
  );
  
  export const inviteUser = createAsyncThunk(
    'userManagement/inviteUser',
    async (userData, { rejectWithValue }) => {
      try {
        console.log('Inviting user:', userData);
        
        // Log auth details for debugging
        const token = localStorage.getItem('token');
        const companyCode = localStorage.getItem('companyCode');
        console.log('Auth details for invite:', { 
          hasToken: !!token, 
          tokenFirstChars: token ? token.substring(0, 10) + '...' : 'none',
          companyCode 
        });
        
        const response = await api.post('/users/invite', userData);
        console.log('User invited successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error inviting user:', error);
        
        // More detailed error logging
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
        }
        
        return rejectWithValue(error.response?.data?.message || 'Failed to invite user');
      }
    }
  );
  
  export const updateUserRole = createAsyncThunk(
    'userManagement/updateUserRole',
    async ({ userId, role }, { rejectWithValue }) => {
      try {
        console.log(`Updating role for user ${userId} to ${role}`);
        const response = await api.put(`/roles/users/${userId}/role`, { role });
        console.log('User role updated successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating user role:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
      }
    }
  );
  
  export const updateUserPermissions = createAsyncThunk(
    'userManagement/updateUserPermissions',
    async ({ userId, permissions }, { rejectWithValue }) => {
      try {
        console.log(`Updating permissions for user ${userId}`);
        const response = await api.put(`/roles/users/${userId}/permissions`, { permissions });
        console.log('User permissions updated successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating user permissions:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to update user permissions');
      }
    }
  );
  
  // Initial state
  const initialState = {
    users: [],
    loading: false,
    error: null,
    inviteSuccess: false,
    updateSuccess: false
  };
  
  // Create slice
  const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    reducers: {
      clearUserManagementState: (state) => {
        state.error = null;
        state.inviteSuccess = false;
        state.updateSuccess = false;
      }
    },
    extraReducers: (builder) => {
      builder
        // Fetch users cases
        .addCase(fetchUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch users';
        })
        
        // Invite user cases
        .addCase(inviteUser.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.inviteSuccess = false;
        })
        .addCase(inviteUser.fulfilled, (state) => {
          state.loading = false;
          state.inviteSuccess = true;
        })
        .addCase(inviteUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to invite user';
          state.inviteSuccess = false;
        })
        
        // Update user role cases
        .addCase(updateUserRole.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.updateSuccess = false;
        })
        .addCase(updateUserRole.fulfilled, (state, action) => {
          state.loading = false;
          state.updateSuccess = true;
          
          // Update the user in the users array
          const updatedUser = action.payload.user;
          state.users = state.users.map(user => 
            user._id === updatedUser._id ? updatedUser : user
          );
        })
        .addCase(updateUserRole.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update user role';
          state.updateSuccess = false;
        })
        
        // Update user permissions cases
        .addCase(updateUserPermissions.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.updateSuccess = false;
        })
        .addCase(updateUserPermissions.fulfilled, (state, action) => {
          state.loading = false;
          state.updateSuccess = true;
          
          // Update the user in the users array
          const updatedUser = action.payload.user;
          state.users = state.users.map(user => 
            user._id === updatedUser._id ? updatedUser : user
          );
        })
        .addCase(updateUserPermissions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update user permissions';
          state.updateSuccess = false;
        });
    }
  });
  
  export const { clearUserManagementState } = userManagementSlice.actions;
  
  // Selectors
  export const selectUsers = (state) => state.userManagement.users;
  export const selectUserManagementLoading = (state) => state.userManagement.loading;
  export const selectUserManagementError = (state) => state.userManagement.error;
  export const selectInviteSuccess = (state) => state.userManagement.inviteSuccess;
  export const selectUpdateSuccess = (state) => state.userManagement.updateSuccess;
  
  export default userManagementSlice.reducer;
  