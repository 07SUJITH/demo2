// src/components/auth/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

export const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // If the user is already authenticated, redirect them to the dashboard.
  // Otherwise, render the public route contents.
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
