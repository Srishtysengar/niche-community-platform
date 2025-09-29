// src/features/reaction/reactionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

// Add or update a reaction
export const reactToPost = createAsyncThunk(
  "reactions/reactToPost",
  async ({ postId, type }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const { data } = await API.post(
        "/reactions", 
        { postId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, reaction: data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to react to post"
      );
    }
  }
);

// Fetch reactions for a post
export const fetchReactionsForPost = createAsyncThunk(
  "reactions/fetchReactionsForPost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const { data } = await API.get(`/reactions/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, reactions: data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reactions"
      );
    }
  }
);

const reactionSlice = createSlice({
  name: "reactions",
  initialState: {
    byPost: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // React to post
      .addCase(reactToPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, reaction } = action.payload;
        if (!state.byPost[postId]) state.byPost[postId] = [];
        //update or add reaction for the user
        const idx = state.byPost[postId].findIndex(
          (r) => r.user === reaction.user
        );
        if (idx !== -1) {
          state.byPost[postId][idx] = reaction;
        } else {
          state.byPost[postId].push(reaction);
        }
      })
      .addCase(reactToPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch reactions
      .addCase(fetchReactionsForPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReactionsForPost.fulfilled, (state, action) => {
        state.loading = false;
        state.byPost[action.payload.postId] = action.payload.reactions;
      })
      .addCase(fetchReactionsForPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reactionSlice.reducer;
