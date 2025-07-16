import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";

import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { TooltipProvider } from "./components/ui/tooltip";
import AuthProvider from "./context/AuthContext";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import EndpointDetail from "./pages/landing/EndpointDetail";
// Pages
import { LandingPage } from "./pages/landing/LandingPage";

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/endpoint/:id" element={<EndpointDetail />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                </Route>

                <Route
                  path="/reset-password/:uidb64/:token"
                  element={<ResetPasswordPage />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  {/* Add other protected routes here */}
                </Route>

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: "var(--toast-bg)",
                    color: "var(--toast-color)",
                    border: "1px solid var(--border)",
                    backdropFilter: "none",
                    filter: "none",
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
