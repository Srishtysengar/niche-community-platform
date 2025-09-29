import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

// Fetch comments for a post
export const fetchCommentsByPost = createAsyncThunk(
  "comments/fetchByPost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const { data } = await API.get(`/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, comments: data };
    } catch (err) {
      console.error("Error fetching comments:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to load comments"
      );
    }
  }
);

// Add a comment
export const addComment = createAsyncThunk(
  "comments/add",
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const { data } = await API.post(
        `/comments`,
        { postId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, comment: data };
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: { byPost: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.byPost[action.payload.postId] = action.payload.comments;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.byPost[postId]) state.byPost[postId] = [];
        state.byPost[postId].unshift(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;