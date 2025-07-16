import { privateAxios, publicAxios } from "./axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password1: string;
  password2: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  is_verified: boolean;
  date_joined: string;
  last_login: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ResetPasswordData {
  new_password: string;
  confirm_password: string;
}

const authService = {
  // User registration - Public
  register: async (data: RegisterData) => {
    const response = await publicAxios.post("/users/register/", data);
    return response.data;
  },

  // User login - Public
  login: async (credentials: LoginCredentials) => {
    const response = await publicAxios.post("/auth/login/", credentials);
    return response.data;
  },

  // Get user profile - Private
  getProfile: async (): Promise<UserProfile> => {
    const response = await privateAxios.get("/users/profile/");
    return response.data;
  },

  // Verify OTP - Public
  verifyOtp: async (data: OtpVerificationData) => {
    const response = await publicAxios.post("/auth/verify-otp/", data);
    return response.data;
  },

  // Resend OTP - Public
  resendOtp: async (data: ResendOtpData) => {
    const response = await publicAxios.post("/auth/resend-otp/", data);
    return response.data;
  },

  // Logout - Private
  logout: async () => {
    const response = await privateAxios.post("/auth/logout/");
    return response.data;
  },

  // Change password - Private
  changePassword: async (data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    const response = await privateAxios.post("/auth/change-password/", data);
    return response.data;
  },

  // Send password reset email - Public
  sendPasswordResetEmail: async (email: string) => {
    const response = await publicAxios.post(
      "/auth/send-reset-password-email/",
      { email }
    );
    return response.data;
  },

  // Reset password with token - Public
  resetPassword: async (
    uidb64: string,
    token: string,
    data: ResetPasswordData
  ) => {
    const response = await publicAxios.post(
      `/auth/reset-password/${uidb64}/${token}/`,
      data
    );
    return response.data;
  },

  // Token refresh - Public (no auth required as it uses refresh token from cookies)
  refreshToken: async () => {
    const response = await publicAxios.post("/auth/token/refresh/", {});
    return response.data;
  },
};

export default authService;
