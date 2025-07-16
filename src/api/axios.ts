import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";

// Extend AxiosRequestConfig to add the `_retry` property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Public endpoints that don't require auth
const publicEndpoints = [
  "/auth/login/",
  "/auth/register/",
  "/auth/verify-otp/",
  "/auth/resend-otp/",
  "/auth/send-reset-password-email/",
  "/auth/reset-password/",
];

// Base configuration
const baseConfig: AxiosRequestConfig = {
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies
};

// Create base axios instance (for backward compatibility)
const axiosInstance: AxiosInstance = axios.create(baseConfig);

// Create public axios instance (no credentials needed for public endpoints)
export const publicAxios: AxiosInstance = axios.create({
  ...baseConfig,
  withCredentials: true, // No need for cookies in public endpoints but we set ,no issue with set otherwise on login cookie will not be set
});

// Create private axios instance (with credentials for authenticated requests)
export const privateAxios: AxiosInstance = axios.create({
  ...baseConfig,
  withCredentials: true, // Required for cookies
});

// Response interceptor for private instance to handle 401 errors
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If error is not 401 or no original request, reject
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Skip token refresh for public endpoints
    if (originalRequest.url) {
      const isPublicUrl = publicEndpoints.some((endpoint: string) =>
        originalRequest.url?.includes(endpoint)
      );

      if (isPublicUrl) {
        return Promise.reject(error);
      }
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      // Handle auth failure - clear auth state and redirect
      handleAuthFailure();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Try to refresh token using a fresh axios instance to avoid interceptor loops
      const refreshAxios = axios.create({
        baseURL,
        withCredentials: true,
        timeout: 10000,
      });

      await refreshAxios.post("/auth/token/refresh/", {});

      // Retry the original request with new token (cookies are automatically included)
      return privateAxios(originalRequest);
    } catch (refreshError) {
      // If refresh fails, handle auth failure
      handleAuthFailure();
      return Promise.reject(refreshError);
    }
  }
);

// Helper function to handle authentication failures
function handleAuthFailure() {
  // Clear auth state by dispatching a logout action
  // We'll import and call the auth store's logout method
  try {
    // Import the auth store dynamically to avoid circular dependency
    import("../store/authStore").then(({ useAuthStore }) => {
      const authStore = useAuthStore.getState();
      authStore.logout().catch(() => {
        // If logout fails, at least clear the state
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      });
    });
  } catch (error) {
    console.error("Failed to clear auth state:", error);
  }

  // Redirect to login if not already there
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export default axiosInstance;
