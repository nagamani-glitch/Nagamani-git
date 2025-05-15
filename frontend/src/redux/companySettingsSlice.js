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
    
    console.log('Company Settings API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      companyCode
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
    }
    return Promise.reject(error);
  }
);

// Async thunks
export const fetchCompanyDetails = createAsyncThunk(
  'companySettings/fetchCompanyDetails',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching company details...');
      const response = await api.get('/company');
      console.log('Company details fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Error fetching company details:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company details');
    }
  }
);

export const updateCompanyDetails = createAsyncThunk(
  'companySettings/updateCompanyDetails',
  async (companyData, { rejectWithValue }) => {
    try {
      console.log('Updating company details:', companyData);
      const response = await api.put('/company', companyData);
      console.log('Company details updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating company details:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update company details');
    }
  }
);

export const updateCompanySettings = createAsyncThunk(
  'companySettings/updateCompanySettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      console.log('Updating company settings:', settingsData);
      const response = await api.put('/company/settings', settingsData);
      console.log('Company settings updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating company settings:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update company settings');
    }
  }
);

// Initial state
const initialState = {
  companyData: null,
  loading: false,
  error: null,
  updateSuccess: false
};

// Create slice
const companySettingsSlice = createSlice({
  name: 'companySettings',
  initialState,
  reducers: {
    clearCompanySettingsState: (state) => {
      state.error = null;
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch company details cases
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch company details';
      })
      
      // Update company details cases
      .addCase(updateCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        if (action.payload.company) {
          state.companyData = action.payload.company;
        }
      })
      .addCase(updateCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update company details';
        state.updateSuccess = false;
      })
      
      // Update company settings cases
      .addCase(updateCompanySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateCompanySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        if (state.companyData && action.payload.settings) {
          state.companyData.settings = action.payload.settings;
        }
      })
      .addCase(updateCompanySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update company settings';
        state.updateSuccess = false;
      });
  }
});

export const { clearCompanySettingsState } = companySettingsSlice.actions;

// Selectors
export const selectCompanyData = (state) => state.companySettings.companyData;
export const selectCompanySettingsLoading = (state) => state.companySettings.loading;
export const selectCompanySettingsError = (state) => state.companySettings.error;
export const selectCompanyUpdateSuccess = (state) => state.companySettings.updateSuccess;

export default companySettingsSlice.reducer;
