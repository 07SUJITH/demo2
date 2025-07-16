import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../store/authStore";

interface ProtectedRouteProps {
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireVerification = true,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If verification is required but user is not verified, redirect to verification page
  if (requireVerification && !user?.is_verified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
