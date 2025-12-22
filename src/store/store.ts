import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import mailReducer from "./mailStore"; // <--- 1. Import this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer, // <--- 2. Add this line!
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;