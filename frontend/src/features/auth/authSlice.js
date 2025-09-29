import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

// --- Thunks ---
export const login = createAsyncThunk("auth/login", async (formData, thunkAPI) => {
  try {
    const res = await API.post("/auth/login", formData);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
  try {
    const res = await API.post("/auth/register", formData);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Register failed");
  }
});

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetAuthState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload;
        if (msg.includes("User not found")) {
          state.error = "User not found, please register first.";
        } else if (msg.includes("Invalid credentials")) {
          state.error = "Incorrect password, please try again.";
        } else {
          state.error = msg;
        }
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "User registered successfully. Please login.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload;
        if (msg.includes("User already exists")) {
          state.error = "User already exists, please login.";
        } else {
          state.error = msg;
        }
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
