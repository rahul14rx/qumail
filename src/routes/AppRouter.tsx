import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { AppShell } from "../components/AppShell";

export default function AppRouter() {
  return (
    <Routes>
      {/* CHANGE: Always go to Login first. 
          The Login page will check if you are already logged in. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app/*" element={<AppShell />} />
      </Route>

      {/* Catch-all: If lost, go back to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}