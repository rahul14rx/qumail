import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as AuthAPI from "../services/auth";

type AuthState = {
  token: string | null;
  user: AuthAPI.PublicUser | null;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const TOKEN_KEY = "qumail_token";

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  status: "idle",
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: AuthAPI.RegisterPayload) => AuthAPI.registerUser(payload)
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: AuthAPI.LoginPayload) => AuthAPI.loginUser(payload)
);

export const meThunk = createAsyncThunk(
  "auth/me",
  async (token: string) => AuthAPI.me(token)
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    setUser(state, action: PayloadAction<AuthAPI.PublicUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerThunk.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerThunk.fulfilled, (s) => {
        s.status = "idle";
      })
      .addCase(registerThunk.rejected, (s, a) => {
        s.status = "error";
        s.error = a.error.message ?? "Register failed";
      })

      // login
      .addCase(loginThunk.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.status = "idle";
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(TOKEN_KEY, a.payload.token);
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.status = "error";
        s.error = a.error.message ?? "Login failed";
      })

      // me
      .addCase(meThunk.pending, (s) => {
        s.status = "loading";
      })
      .addCase(meThunk.fulfilled, (s, a) => {
        s.status = "idle";
        s.user = a.payload.user;
      })
      // --- CRITICAL FIX BELOW ---
      .addCase(meThunk.rejected, (s) => {
        s.status = "error";
        s.user = null;
        s.token = null; // Kill the bad token
        localStorage.removeItem(TOKEN_KEY); // Clear storage
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;