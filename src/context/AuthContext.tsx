import { useEffect } from "react";

import { useAuth } from "../store/authStore";

// List of public routes that don't require auth check
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/", // Landing page
];

// Check if current path is a public route
const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + "/")
  );
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, isLoading } = useAuth();

  // Run auth check on mount only if not on a public route
  useEffect(() => {
    const currentPath = window.location.pathname;

    // Skip auth check for public routes
    if (!isPublicRoute(currentPath)) {
      checkAuth();
    }
  }, [checkAuth]);

  // Show loading state only if we're checking auth and not on a public route
  const currentPath = window.location.pathname;
  const shouldShowLoading = !isPublicRoute(currentPath) && isLoading;

  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
