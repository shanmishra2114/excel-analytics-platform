import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from './authSlice';
import { apiFetch } from '../../lib/api';  // 👈 import your helper

interface AdminState {
  users: User[];
  analytics: {
    totalUsers: number;
    totalUploads: number;
    totalCharts: number;
    recentActivity: any[];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  analytics: {
    totalUsers: 0,
    totalUploads: 0,
    totalCharts: 0,
    recentActivity: [],
  },
  isLoading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { getState }: any) => {
    const token = getState().auth.token;
    return await apiFetch('/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }
);

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (_, { getState }: any) => {
    const token = getState().auth.token;
    return await apiFetch('/admin/analytics', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async (
    { userId, role }: { userId: string; role: 'user' | 'admin' },
    { getState }: any
  ) => {
    const token = getState().auth.token;
    return await apiFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { getState }: any) => {
    const token = getState().auth.token;
    await apiFetch(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return userId; // return only the ID so we can remove from state
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch analytics
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
