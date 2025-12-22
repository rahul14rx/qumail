import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { meThunk } from "../store/authSlice";

export default function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => s.auth);

  // 1. Initial Check: Do we even have a token?
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Hydration Check: Have token, but no user data? Fetch it!
  useEffect(() => {
    if (token && !user) {
      dispatch(meThunk(token));
    }
  }, [token, user, dispatch]);

  // 3. Loading State: If we are fetching, show a simple loader
  // (Optional: You can remove this if you want it to flash)
  if (token && !user) {
    return (
      <div style={{ 
        height: "100vh", 
        background: "#09090b", 
        color: "white", 
        display: "grid", 
        placeItems: "center" 
      }}>
        Loading Security Profile...
      </div>
    );
  }

  // 4. All good? Render the App
  return <Outlet />;
}