import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

// --- Thunks ---
// Fetch all communities
export const fetchCommunities = createAsyncThunk(
  "community/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/communities");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load communities");
    }
  }
);

// Create community
export const createCommunity = createAsyncThunk(
  "community/create",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/communities", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create community");
    }
  }
);

// Join community
export const joinCommunity = createAsyncThunk(
  "community/joinCommunity",
  async (communityId, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/communities/${communityId}/join`);
      return data; // updated community from backend
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to join community");
    }
  }
);


// --- Slice ---
const communitySlice = createSlice({
  name: "community",
  initialState: {
    communities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.communities.push(action.payload);
      })
      // Join
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const updatedCommunity = action.payload;

        // Find the community and update it in state
        const idx = state.communities.findIndex((c) => c._id === updatedCommunity._id);
        if (idx !== -1) {
          state.communities[idx] = updatedCommunity;
        }
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default communitySlice.reducer;
