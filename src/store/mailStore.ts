import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMailDataAPI, MailPayload } from "../services/mail";

// Define Email Interface
export interface Email extends MailPayload {
  id: string;
  timestamp: number;
}

interface MailState {
  inbox: Email[];
  sent: Email[];
  loading: boolean;
  error: string | null;
}

const initialState: MailState = {
  inbox: [],
  sent: [],
  loading: false,
  error: null,
};

// --- UPDATED THUNK ---
export const fetchInboxThunk = createAsyncThunk(
  "mail/fetchAll",
  async (username: string) => {
    // Calls the new function that gets BOTH inbox and sent
    return await fetchMailDataAPI(username);
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInboxThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInboxThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Now this matches perfectly!
        state.inbox = action.payload.inbox;
        state.sent = action.payload.sent;
      })
      .addCase(fetchInboxThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load mail";
      });
  },
});

export default mailSlice.reducer;