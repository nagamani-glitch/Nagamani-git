import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  inviteUser,
  updateUserRole,
  updateUserPermissions,
  clearUserManagementState,
  selectUsers,
  selectUserManagementLoading,
  selectUserManagementError,
  selectInviteSuccess,
  selectUpdateSuccess
} from '../redux/userManagementSlice';

export const useUserManagement = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserManagementLoading);
  const error = useSelector(selectUserManagementError);
  const inviteSuccess = useSelector(selectInviteSuccess);
  const updateSuccess = useSelector(selectUpdateSuccess);
  
  // Fetch all users
  const getUsers = useCallback(() => {
    console.log('Fetching users from hook');
    return dispatch(fetchUsers());
  }, [dispatch]);
  
  // Invite a new user
  const invite = useCallback((userData) => {
    console.log('Inviting user from hook:', userData);
    return dispatch(inviteUser(userData));
  }, [dispatch]);
  
  // Update user role
  const changeRole = useCallback((userId, role) => {
    console.log(`Changing role for user ${userId} to ${role} from hook`);
    return dispatch(updateUserRole({ userId, role }));
  }, [dispatch]);
  
  // Update user permissions
  const changePermissions = useCallback((userId, permissions) => {
    console.log(`Changing permissions for user ${userId} from hook`);
    return dispatch(updateUserPermissions({ userId, permissions }));
  }, [dispatch]);
  
  // Clear state
  const clearState = useCallback(() => {
    dispatch(clearUserManagementState());
  }, [dispatch]);
  
  return {
    users,
    loading,
    error,
    inviteSuccess,
    updateSuccess,
    getUsers,
    invite,
    changeRole,
    changePermissions,
    clearState
  };
};
