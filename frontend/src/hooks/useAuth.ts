import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loginUser, registerUser, logout, fetchUser } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = (credentials: { email: string; password: string }) => {
    return dispatch(loginUser(credentials));
  };

  const register = (userData: { name: string; email: string; password: string }) => {
    return dispatch(registerUser(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const getCurrentUser = () => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    getCurrentUser,
  };
};