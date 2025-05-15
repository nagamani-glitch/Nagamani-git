import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompanyDetails,
  updateCompanyDetails,
  updateCompanySettings,
  clearCompanySettingsState,
  selectCompanyData,
  selectCompanySettingsLoading,
  selectCompanySettingsError,
  selectCompanyUpdateSuccess
} from '../redux/companySettingsSlice';

export const useCompanySettings = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const companyData = useSelector(selectCompanyData);
  const loading = useSelector(selectCompanySettingsLoading);
  const error = useSelector(selectCompanySettingsError);
  const updateSuccess = useSelector(selectCompanyUpdateSuccess);
  
  // Fetch company details
  const getCompanyDetails = useCallback(() => {
    console.log('Fetching company details from hook');
    return dispatch(fetchCompanyDetails());
  }, [dispatch]);
  
  // Update company details
  const updateDetails = useCallback((data) => {
    console.log('Updating company details from hook:', data);
    return dispatch(updateCompanyDetails(data));
  }, [dispatch]);
  
  // Update company settings
  const updateSettings = useCallback((data) => {
    console.log('Updating company settings from hook:', data);
    return dispatch(updateCompanySettings(data));
  }, [dispatch]);
  
  // Clear state
  const clearState = useCallback(() => {
    dispatch(clearCompanySettingsState());
  }, [dispatch]);
  
  return {
    companyData,
    loading,
    error,
    updateSuccess,
    getCompanyDetails,
    updateDetails,
    updateSettings,
    clearState
  };
};
