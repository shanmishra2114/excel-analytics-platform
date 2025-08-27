import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../lib/api'; // adjust path if api.ts is elsewhere

export interface ChartConfig {
  id?: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | '3d-bar' | '3d-scatter';
  xAxis: string;
  yAxis: string;
  title: string;
  fileId: string;
  createdAt?: string;
}

export interface SavedChart extends ChartConfig {
  id: string;
  createdAt: string;
  fileName: string;
}

interface ChartState {
  savedCharts: SavedChart[];
  currentChart: ChartConfig | null;
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ChartState = {
  savedCharts: [],
  currentChart: null,
  isGenerating: false,
  isSaving: false,
  error: null,
};

// ✅ Save chart
export const saveChart = createAsyncThunk(
  'chart/save',
  async (chartConfig: ChartConfig, { getState }: any) => {
    const token = getState().auth.token;
    return await apiFetch('/charts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chartConfig),
    });
  }
);

// ✅ Fetch user charts
export const fetchUserCharts = createAsyncThunk(
  'chart/fetchUserCharts',
  async (_, { getState }: any) => {
    const token = getState().auth.token;
    return await apiFetch('/charts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
);

// ✅ Delete chart
export const deleteChart = createAsyncThunk(
  'chart/delete',
  async (chartId: string, { getState }: any) => {
    const token = getState().auth.token;
    await apiFetch(`/charts/${chartId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return chartId;
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
    },
    clearCurrentChart: (state) => {
      state.currentChart = null;
    },
    setGenerating: (state, action) => {
      state.isGenerating = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save chart
      .addCase(saveChart.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveChart.fulfilled, (state, action) => {
        state.isSaving = false;
        state.savedCharts.unshift(action.payload);
      })
      .addCase(saveChart.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to save chart';
      })
      // Fetch charts
      .addCase(fetchUserCharts.fulfilled, (state, action) => {
        state.savedCharts = action.payload;
      })
      // Delete chart
      .addCase(deleteChart.fulfilled, (state, action) => {
        state.savedCharts = state.savedCharts.filter(chart => chart.id !== action.payload);
      });
  },
});

export const { setCurrentChart, clearCurrentChart, setGenerating, clearError } = chartSlice.actions;
export default chartSlice.reducer;
