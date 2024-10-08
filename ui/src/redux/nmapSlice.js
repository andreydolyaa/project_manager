import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/index";

export const startScan = createAsyncThunk(
  "nmap/startScan",
  async ({ data, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/nmap", { data, userId });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue({ message: "An error occurred" });
    }
  }
);

export const getLastScan = createAsyncThunk(
  "nmap/getLastScan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/nmap/last");
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue({ message: "An error occurred" });
    }
  }
);

export const getAllScans = createAsyncThunk(
  "nmap/getAllScans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/nmap/all");
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue({ message: "An error occurred" });
    }
  }
);

export const nmapSlice = createSlice({
  name: "nmap",
  initialState: {
    loading: false,
    status: "idle",
    scans: [],
    scan: null,
    messages: [],
    scanId: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startScan.pending, (state) => {
        state.loading = true;
      })
      .addCase(startScan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.scanId = action.payload.scanId;
      })
      .addCase(startScan.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
      })
      .addCase(getLastScan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLastScan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.messages = action.payload.scan;
      })
      .addCase(getLastScan.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
      })
      .addCase(getAllScans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllScans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.scans = action.payload;
      })
      .addCase(getAllScans.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
      });
  },
});

export const { addMessage, clearMessages } = nmapSlice.actions;
export default nmapSlice.reducer;
