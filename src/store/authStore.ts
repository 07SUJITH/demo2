import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserProfile } from "../api/authService";
import authService from "../api/authService";

interface ApiError extends Error {
  response?: {
    data?: {
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
      email?: string;
      is_verified?: boolean;
    };
  };
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  theme: string;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    requiresVerification?: boolean;
    email?: string;
    message?: string;
  }>;
  register: (
    email: string,
    password1: string,
    password2: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setTheme: (theme: string) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      theme: "system",

      setTheme: theme => {
        set({ theme });
      },

      changePassword: async (currentPassword, newPassword, confirmPassword) => {
        // Clear any existing error but don't set global loading state
        set({ error: null });
        try {
          await authService.changePassword({
            old_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          });
          // Password change successful - no need to update global state
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const errorMessage =
            apiError.response?.data?.message || "Failed to change password";
          set({ error: errorMessage });
          // Re-throw the error so it can be caught by the component
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await authService.login({ email, password });
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: unknown) {
          const apiError = error as ApiError;
          let errorMessage = "Login failed. Please try again.";
          let shouldThrow = true;

          // Handle email not verified case
          if (
            apiError.response?.data?.message === "Email not verified" ||
            apiError.response?.data?.is_verified === false
          ) {
            const userEmail = apiError.response?.data?.email || email;
            errorMessage = "Please verify your email before logging in.";
            shouldThrow = false;
            set({
              error: errorMessage,
              isLoading: false,
              user: {
                email: userEmail,
                is_verified: false,
                // Add minimal required fields for UserProfile
                id: 0,
                username: userEmail.split("@")[0],
                date_joined: new Date().toISOString(),
              } as UserProfile,
            });
            return {
              success: false,
              requiresVerification: true,
              email: userEmail,
            };
          }

          // Handle other error cases
          if (apiError.response?.data) {
            const { detail, message, errors } = apiError.response.data;

            if (detail) {
              errorMessage = detail;
            } else if (message) {
              errorMessage = message;
            } else if (errors) {
              // Join all error messages from the errors object
              const errorMessages = Object.entries(errors)
                .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                .join("; ");
              errorMessage = errorMessages || errorMessage;
            }
          } else if (apiError.message) {
            errorMessage = apiError.message;
          }

          set({ error: errorMessage, isLoading: false });

          if (shouldThrow) {
            throw new Error(errorMessage);
          }

          return { success: false, message: errorMessage };
        }
      },

      register: async (email, password1, password2) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register({ email, password1, password2 });
          set({ isLoading: false });
        } catch (error: unknown) {
          const message =
            (error as ApiError)?.response?.data?.detail ||
            "Registration failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyOtp({ email, otp });
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const message =
            (error as ApiError)?.response?.data?.detail ||
            "OTP verification failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      resendOtp: async email => {
        set({ isLoading: true, error: null });
        try {
          await authService.resendOtp({ email });
          set({ isLoading: false });
        } catch (error: unknown) {
          const message =
            (error as ApiError)?.response?.data?.detail ||
            "Failed to resend OTP. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => useAuthStore(state => state);
