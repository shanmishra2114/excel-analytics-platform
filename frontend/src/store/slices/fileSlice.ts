import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '@/lib/api'; // <-- import base URL

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  size: number;
  status: 'processing' | 'completed' | 'error';
  data?: any;
  columns?: string[];
}

interface FileState {
  uploads: FileUpload[];
  currentFile: FileUpload | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  parsedData: any[];
  columns: string[];
}

const initialState: FileState = {
  uploads: [],
  currentFile: null,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  parsedData: [],
  columns: [],
};

export const uploadFile = createAsyncThunk(
  'file/upload',
  async (file: File, { getState }: any) => {
    const token = getState().auth.token;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  }
);

export const fetchUserFiles = createAsyncThunk(
  'file/fetchUserFiles',
  async (_, { getState }: any) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/files`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    return await response.json();
  }
);

export const deleteFile = createAsyncThunk(
  'file/delete',
  async (fileId: string, { getState }: any) => {
    const token = getState().auth.token;
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return fileId;
  }
);

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
      if (action.payload?.data) {
        state.parsedData = action.payload.data;
        state.columns = action.payload.columns || [];
      }
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
      state.parsedData = [];
      state.columns = [];
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.uploads.unshift(action.payload);
        state.currentFile = action.payload;
        if (action.payload.data) {
          state.parsedData = action.payload.data;
          state.columns = action.payload.columns || [];
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.error.message || 'Upload failed';
      })
      // Fetch user files
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.uploads = action.payload;
      })
      // Delete file
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.uploads = state.uploads.filter(file => file.id !== action.payload);
        if (state.currentFile?.id === action.payload) {
          state.currentFile = null;
          state.parsedData = [];
          state.columns = [];
        }
      });
  },
});

export const { setCurrentFile, clearCurrentFile, setUploadProgress, clearError } = fileSlice.actions;
export default fileSlice.reducer;
