import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import fileSlice from './slices/fileSlice';
import chartSlice from './slices/chartSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    file: fileSlice,
    chart: chartSlice,
    admin: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;