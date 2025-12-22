import { createAsyncThunk } from "@reduxjs/toolkit";

export type MailPayload = {
  from: string;
  to: string;
  subject: string;
  body: string;
  level: number;
  keyId?: string;
  id?: string;
  timestamp?: number;
};

const BASE_URL = "http://localhost:6060/api/v1";

// --- API FUNCTIONS ---

export async function sendMailAPI(payload: MailPayload) {
  const res = await fetch(`${BASE_URL}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to send mail");
  }
  return res.json();
}

// --- FIXED FUNCTION BELOW ---
export async function fetchMailDataAPI(username: string) {
  // 1. Fetch Inbox
  const inboxRes = await fetch(`${BASE_URL}/inbox/${username}`);
  const inboxData = inboxRes.ok ? await inboxRes.json() : { messages: [] };

  // 2. Fetch Sent
  const sentRes = await fetch(`${BASE_URL}/sent/${username}`);
  const sentData = sentRes.ok ? await sentRes.json() : { messages: [] };

  // 3. Return combined object (Extracting .messages array!)
  return {
    inbox: Array.isArray(inboxData.messages) ? inboxData.messages : [],
    sent: Array.isArray(sentData.messages) ? sentData.messages : [],
  };
}

// --- REDUX THUNKS ---

export const sendMailThunk = createAsyncThunk(
  "mail/send",
  async (payload: MailPayload) => {
    return await sendMailAPI(payload);
  }
);