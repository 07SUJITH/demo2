export interface EndpointData {
  id: string;
  name: string;
  method: string;
  url: string;
  description: string;
  fullDescription: string;
  authentication: string;
  requestBody?: {
    type: string;
    example?: Record<string, unknown>;
    schema?: Record<string, unknown>;
  };
  responseExamples?: {
    status: number;
    description: string;
    body: Record<string, unknown>;
  }[];
  headers?: { key: string; value: string }[];
  pathParams?: { key: string; description: string }[];
  queryParams?: { key: string; description: string }[];
  category: string;
  technicalNotes?: string;
  relatedEndpoints?: string[];
  errorHandling?: {
    status: number;
    message: string;
    nextSteps?: string;
  }[];
}

const endpointsData: EndpointData[] = [
  {
    id: "user-authenticated-user-profile",
    name: "Authenticated User Profile",
    method: "GET",
    url: "/users/profile/",
    description: "Retrieve information about the authenticated user.",
    fullDescription: `
# User Profile Fetch API Endpoint

**User Profile Fetch API** endpoint for retrieving information about the authenticated user. The endpoint requires authentication via JWT tokens and implements a token refresh mechanism to ensure secure and seamless access to protected resources.

## Endpoint Details
- **URL**: \`http://127.0.0.1:8000/api/v1/users/profile/\`
- **Method**: \`GET\`
- **Authentication**: Required (JWT access token in cookies)
- **Permission**: \`IsAuthenticated\`
- **Content-Type**: \`application/json\`

## Authentication Flow
The endpoint requires a valid JWT access token to be present in the cookies. If the access token is missing or expired, the following flow is used to maintain user session security and convenience:

1. **Access Token Missing or Expired**:
   - \`{ "detail": "Authentication credentials were not provided." }\`
   - The frontend should redirect to the token refresh endpoint (\`/api/v1/auth/token/refresh/\`) to attempt token refresh.

2. **Token Refresh**:
   - The refresh token (stored in cookies) is sent to \`/api/v1/auth/token/refresh/\`.
   - On success, the endpoint rotates the refresh token and returns a new access token and refresh token, which are set in cookies with a max age equal to their respective lifetimes.
   - The frontend automatically retries the original profile fetch request with the new access token.

3. **Refresh Token Missing or Expired**:
   - If the refresh token is missing or invalid, the refresh endpoint returns a \`400 Bad Request\` or similar error.
   - The frontend removes any expired tokens from cookies and redirects the user to the login page (\`/api/v1/auth/login/\`).
   - The user must re-enter credentials to generate new access and refresh tokens.

4. **Seamless Experience**:
   - This flow ensures users feel logged in without needing to re-authenticate manually, while maintaining security through token rotation and automatic token removal after expiry.

This authentication flow applies to all endpoints requiring authentication.

## Request Format
- **Method**: \`GET\`
- **Headers**: None required (JWT access token is expected in cookies).
- **Body**: Not required for \`GET\` requests.

### Example Request
\`\`\`http
GET /api/v1/users/profile/ HTTP/1.1
Host: 127.0.0.1:8000
Cookie: access_token=<JWT_ACCESS_TOKEN>
\`\`\`

## Response Format
### Success Response (200 OK)
Returned when the authenticated user's information is successfully retrieved.
\`\`\`json
{
  "id": 33,
  "username": "sujith94967",
  "email": "sujith94967@gmail.com",
  "is_verified": true,
  "date_joined": "2025-07-10T06:50:56Z"
}
\`\`\`
- **Fields**:
  - \`id\`: The unique ID of the user.
  - \`username\`: The automatically generated username.
  - \`email\`: The user's email address.
  - \`is_verified\`: Boolean indicating if the email is verified.
  - \`date_joined\`: The timestamp of account creation.

### Error Responses
#### 401 Unauthorized (Missing or Invalid Access Token)
\`\`\`json
{
  "detail": "Authentication credentials were not provided."
}
\`\`\`
- **Next Steps**: Attempt token refresh. If that fails, redirect to login.

#### 400 Bad Request (Refresh Token Failure)
\`\`\`json
{
  "detail": "Refresh token is invalid or missing."
}
\`\`\`
- **Next Steps**: Redirect to login.
`,
    authentication: "JWT via HTTP-only cookies",
    responseExamples: [
      {
        status: 200,
        description: "Success",
        body: {
          id: 33,
          username: "sujith94967",
          email: "sujith94967@gmail.com",
          is_verified: true,
          date_joined: "2025-07-10T06:50:56Z",
        },
      },
      {
        status: 401,
        description: "Unauthorized",
        body: {
          detail: "Authentication credentials were not provided.",
        },
      },
      {
        status: 400,
        description: "Bad Request on Refresh",
        body: {
          detail: "Refresh token is invalid or missing.",
        },
      },
    ],
    category: "User",
    technicalNotes:
      "Uses JWT token rotation. Access tokens are in HttpOnly cookies. Relies on a seamless refresh flow.",
    relatedEndpoints: ["/auth/token/refresh/", "/auth/login/"],
    errorHandling: [
      {
        status: 401,
        message: "Authentication credentials were not provided.",
        nextSteps: "Attempt token refresh, then redirect to login if failed.",
      },
      {
        status: 400,
        message: "Refresh token is invalid or missing.",
        nextSteps: "Remove tokens from cookies and redirect to login.",
      },
    ],
  },
  {
    id: "user-registration",
    name: "Registration",
    method: "POST",
    url: "/users/register/",
    description: "Create a new user account with email verification via OTP.",
    fullDescription: `
# User Registration API Endpoint

Creates new user accounts with email verification via OTP. Enforces IP-based rate limiting, domain restrictions, and password validation.

## Endpoint Details
- **URL**: \`http://127.0.0.1:8000/api/v1/users/register/\`
- **Method**: \`POST\`
- **Authentication**: None (Public)
- **Content-Type**: \`application/json\`

## Request Format
Requires \`email\`, \`password1\`, and matching \`password2\`.

### Example Request
\`\`\`json
{
  "email": "sujithts000777@gmail.com",
  "password1": "pass@123",
  "password2": "pass@123"
}
\`\`\`

## Response Format
### Success Response (201 Created)
\`\`\`json
{
  "message": "Registration successful. Verification OTP sent.",
  "user": {
    "id": 35,
    "email": "sujithts000777@gmail.com",
    "username": "sujithts000777",
    "is_verified": false
  },
  "otp_meta": {
    "resend_available": true,
    "next_resend_in": 60
  }
}
\`\`\`

### Error Responses
- **400 Bad Request**: For validation errors (e.g., duplicate email, weak password).
- **403 Forbidden**: For registrations from a restricted email domain (e.g., tempmail.com).
- **429 Too Many Requests**: If the IP exceeds 20 registration attempts per minute.

## Key Features
- **Password Validation**: Enforces strength, similarity, and commonality checks.
- **Restricted Domains**: Blocks disposable email providers.
- **Rate Limiting**: Protects against brute-force registration attempts.
- **Username Generation**: Automatically creates a unique username from the email.
- **OTP Verification**: Requires email verification before the user can log in.
`,
    authentication: "None",
    requestBody: {
      type: "json",
      example: {
        email: "user@example.com",
        password1: "SecurePass123!",
        password2: "SecurePass123!",
      },
    },
    responseExamples: [
      {
        status: 201,
        description: "Created",
        body: {
          message: "Registration successful. Verification OTP sent.",
          user: {
            id: 35,
            email: "sujithts000777@gmail.com",
            username: "sujithts000777",
            is_verified: false,
          },
          otp_meta: {
            resend_available: true,
            next_resend_in: 60,
          },
        },
      },
      {
        status: 400,
        description: "Bad Request",
        body: {
          detail: "user with this email already exists.",
          errors: {
            email: ["user with this email already exists."],
          },
        },
      },
      {
        status: 403,
        description: "Forbidden",
        body: {
          detail: "Registrations from this domain are currently not allowed.",
        },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: {
          detail:
            "Too many registration attempts from this IP. Try again later.",
        },
      },
    ],
    category: "User",
    technicalNotes:
      "IP-based rate limiting (20 req/min). Auto-generates usernames. Blocks disposable email domains.",
    relatedEndpoints: [
      "/auth/resend-otp/",
      "/auth/verify-otp/",
      "/auth/login/",
    ],
    errorHandling: [
      {
        status: 400,
        message: "Validation errors (duplicate email, weak password, etc.).",
      },
      {
        status: 403,
        message: "Restricted email domain.",
        nextSteps: "Use a different email provider.",
      },
      {
        status: 429,
        message: "Too many registration attempts.",
        nextSteps: "Wait 1 minute before retrying.",
      },
    ],
  },
  {
    id: "authentication-login",
    name: "Login",
    method: "POST",
    url: "/auth/login/",
    description:
      "Authenticate a user and set access & refresh tokens in HTTP-only cookies.",
    fullDescription: `
## 🔑 Login API

Authenticate a user and set access & refresh tokens in HTTP-only cookies.

- **Method:** \`POST\`
- **Endpoint:** \`/login/\`
- **Authentication Required:** ❌ No

### 📥 Request Body
\`\`\`json
{
  "email": "sujith94967@gmail.com",
  "password": "12345678@"
}
\`\`\`

### ✅ Successful Login (Verified User)
**Status:** \`200 OK\`
\`\`\`json
{
  "id": 33,
  "username": "sujith94967",
  "email": "sujith94967@gmail.com",
  "is_verified": true,
  "date_joined": "2025-07-10T06:50:56Z",
  "message": "Login successful"
}
\`\`\`
Sets \`access_token\` and \`refresh_token\` in HttpOnly cookies.

### 🚫 Failed Login Scenarios
- **401 Unauthorized**: If the user's email is not yet verified.
- **400 Bad Request**: For invalid credentials or a malformed email address.
- **429 Too Many Requests**: If the rate limit of 5 login attempts per minute is exceeded.
`,
    authentication: "None",
    requestBody: {
      type: "json",
      example: {
        email: "sujith94967@gmail.com",
        password: "pass@123",
      },
    },
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: {
          id: 33,
          username: "sujith94967",
          email: "sujith94967@gmail.com",
          is_verified: true,
          date_joined: "2025-07-10T06:50:56Z",
          message: "Login successful",
        },
      },
      {
        status: 401,
        description: "Unauthorized",
        body: {
          message:
            "Email not verified. Please verify using the OTP sent to your email.",
          errors: { email: ["User account not verified."] },
          email: "sujith94967@gmail.com",
          is_verified: false,
        },
      },
      {
        status: 400,
        description: "Bad Request",
        body: {
          non_field_errors: ["Invalid credentials"],
        },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: {
          detail: "Too many login attempts from this IP. Try again later.",
        },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "Rate limited to 5 login attempts per IP per minute. Sets HttpOnly cookies on success.",
    relatedEndpoints: ["/auth/verify-otp/", "/auth/token/refresh/"],
    errorHandling: [
      {
        status: 401,
        message: "Email not verified.",
        nextSteps: "User should be prompted to verify their email via OTP.",
      },
      { status: 400, message: "Invalid credentials or email format." },
      {
        status: 429,
        message: "Too many login attempts from this IP.",
        nextSteps: "Wait for the block duration (1 minute) to expire.",
      },
    ],
  },
  {
    id: "authentication-change-password",
    name: "Change Password",
    method: "POST",
    url: "/auth/change-password/",
    description:
      "Allows an authenticated user to securely change their password.",
    fullDescription: `
## 🔐 Change Password API

Allows an authenticated user to securely change their password.

- **Method:** \`POST\`
- **Endpoint:** \`/change-password/\`
- **Authentication Required:** ✅ Yes (JWT via HTTP-only cookies)

### 📥 Request Body
Requires \`old_password\`, \`new_password\`, and matching \`confirm_password\`.
\`\`\`json
{
  "old_password": "currentPassword123",
  "new_password": "newPassword321",
  "confirm_password": "newPassword321"
}
\`\`\`
The \`new_password\` is validated against Django's built-in password validators for strength and similarity.

### ✅ Successful Password Change
**Status:** \`200 OK\`
\`\`\`json
{
  "message": "Password changed successfully."
}
\`\`\`

### 🚫 Error Responses
- **401 Unauthorized**: If the user is not authenticated.
- **400 Bad Request**: For incorrect old password, non-matching new passwords, weak new password, or a password too similar to the user's email.
`,
    authentication: "JWT via HTTP-only cookies",
    requestBody: {
      type: "json",
      example: {
        old_password: "pass@123",
        new_password: "sujith94967@1",
        confirm_password: "sujith94967@1",
      },
    },
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: { message: "Password changed successfully." },
      },
      {
        status: 401,
        description: "Unauthorized",
        body: { detail: "Authentication credentials were not provided." },
      },
      {
        status: 400,
        description: "Bad Request",
        body: { old_password: ["Old password is incorrect"] },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "The new password undergoes validation for strength, commonality, and similarity to user attributes.",
    relatedEndpoints: ["/users/profile/"],
    errorHandling: [
      { status: 401, message: "User is not authenticated." },
      {
        status: 400,
        message: "Incorrect old password or invalid new password.",
      },
    ],
  },
  {
    id: "authentication-send-reset-password-email",
    name: "Send Reset-Password Email",
    method: "POST",
    url: "/auth/send-reset-password-email/",
    description:
      "Request a password reset link to be sent to the user's email.",
    fullDescription: `
### Password Reset Email Endpoint

Allows users to request a password reset link via email. It implements dual-layer rate limiting to prevent abuse.

- **IP-based rate limiting**: 10 requests/minute
- **Email-based rate limiting**: 3 requests/hour

### ✅ Success Response
**Code:** \`200 OK\`
\`\`\`json
{
  "message": "Password reset link sent. Please check your email."
}
\`\`\`

### ❌ Error Responses
- **400 Bad Request**: For invalid email format, unregistered email, or missing email field.
- **429 Too Many Requests**: If either the IP-based or email-based rate limit is exceeded.
`,
    authentication: "None",
    requestBody: {
      type: "json",
      example: { email: "sujith94967@gmail.com" },
    },
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: { message: "Password reset link sent. Please check your email." },
      },
      {
        status: 400,
        description: "Bad Request",
        body: { email: ["No user found with this email address."] },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: {
          detail:
            "Too many password reset requests from this IP. Try again later.",
        },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "Features dual-layer rate limiting: by IP (10/min) and by email (3/hr).",
    relatedEndpoints: ["/auth/reset-password/:uidb64/:token/"],
    errorHandling: [
      { status: 400, message: "Invalid or unregistered email." },
      {
        status: 429,
        message: "Rate limit exceeded for this IP or email.",
        nextSteps: "Wait for the cooldown period to expire.",
      },
    ],
  },
  {
    id: "authentication-token-refresh",
    name: "Token Refresh",
    method: "POST",
    url: "/auth/token/refresh/",
    description:
      "Refresh the access token using a valid refresh_token from cookies.",
    fullDescription: `
Refresh your access token using a valid \`refresh_token\` stored in **HTTP-only cookies**.

- **Method:** \`POST\`
- **Authentication Required:** ✅ Yes (via \`refresh_token\` cookie)
- **No request body required.**

On expiry of an access token, call this endpoint to refresh both the access and refresh tokens without requiring re-login. If token rotation is enabled, the old refresh token is blacklisted and new tokens are issued.

### ✅ Successful Token Refresh
**Status:** \`200 OK\`
**Response Body:**
\`\`\`json
{
  "detail": "Token refreshed successfully"
}
\`\`\`
**Response Headers:** Includes \`Set-Cookie\` for the new \`access_token\` and \`refresh_token\`.

### 🚫 Error Responses
- **401 Unauthorized**: If the refresh token is missing, expired, invalid, or blacklisted.
`,
    authentication: "refresh_token via HTTP-only cookie",
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: { detail: "Token refreshed successfully" },
      },
      {
        status: 401,
        description: "Unauthorized",
        body: { detail: "Token is invalid or expired" },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "No request body is needed. The 'refresh_token' must be present in an HttpOnly cookie. Enables seamless re-authentication when an access token expires.",
    relatedEndpoints: ["/users/profile/"],
    errorHandling: [
      {
        status: 401,
        message: "Refresh token is missing, invalid, or expired.",
        nextSteps: "User must log in again to get a new set of tokens.",
      },
    ],
  },
  {
    id: "authentication-reset-password-confirmation",
    name: "Reset Password Confirmation",
    method: "POST",
    url: "/auth/reset-password/:uidb64/:token/",
    description:
      "Set a new password using the token from the password reset email.",
    fullDescription: `
### Password Reset Confirmation Endpoint

Allows users to set a new password after clicking a reset link. Implements IP throttling and account lockout.

- **IP-based throttling**: 20 requests/minute
- **Account lockout**: After 5 failed attempts

### 📥 Request Structure
**URL Format:** \`/reset-password/<uidb64>/<token>/\`
**Body (JSON):**
\`\`\`json
{
  "new_password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
\`\`\`

### ✅ Success (200 OK)
\`\`\`json
{
  "message": "Password reset successful."
}
\`\`\`

### ❌ Error Responses
- **400 Bad Request**: If the token is invalid or expired.
- **429 Too Many Requests**: If the IP rate limit is exceeded or the account is locked due to too many failed attempts.
`,
    authentication: "Token via URL",
    requestBody: {
      type: "json",
      example: {
        new_password: "pass@321",
        confirm_password: "pass@321",
      },
    },
    pathParams: [
      { key: "uidb64", description: "Base64-encoded user ID." },
      { key: "token", description: "Time-limited password reset token." },
    ],
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: { message: "Password reset successful." },
      },
      {
        status: 400,
        description: "Bad Request",
        body: { detail: "Reset failed. Invalid or expired link." },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: {
          detail:
            "Account temporarily locked. Please wait before trying again.",
        },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "Token in the URL is single-use and expires after 15 minutes. 5 failed attempts will lock the account for 30 minutes.",
    relatedEndpoints: ["/auth/send-reset-password-email/"],
    errorHandling: [
      { status: 400, message: "The reset link is invalid or has expired." },
      {
        status: 429,
        message: "Account locked or IP rate-limited.",
        nextSteps: "Wait for the lockout/cooldown period to expire.",
      },
    ],
  },
  {
    id: "authentication-verify-otp",
    name: "Verify OTP",
    method: "POST",
    url: "/auth/verify-otp/",
    description: "Verifies a user's OTP for account activation.",
    fullDescription: `
## 🔍 OTP Verification API

Verifies a user's OTP for account activation. Protected by **IP-based rate limiting** (30 req/min) and **user-specific lockout** (5 failed attempts lock for 20 mins).

### 📝 Request
\`\`\`json
{
  "email": "user@example.com",
  "otp": "123456"
}
\`\`\`

### ✅ Successful Response
\`\`\`json
{
  "message": "Email verified successfully.",
  "user": {
    "id": 33,
    "email": "sujith94967@gmail.com",
    "is_verified": true
  }
}
\`\`\`

### ❌ Error Responses
- **400 Bad Request**: For various validation issues like invalid OTP, expired OTP, already verified user, or non-existent user.
- **429 Too Many Requests**: If the IP rate limit is exceeded or the account is locked.
`,
    authentication: "None",
    requestBody: {
      type: "json",
      example: {
        email: "sujithts94967@gmail.com",
        otp: "212823",
      },
    },
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: {
          message: "Email verified successfully.",
          user: { id: 33, email: "sujith94967@gmail.com", is_verified: true },
        },
      },
      {
        status: 400,
        description: "Bad Request",
        body: { detail: "Invalid OTP code. Please check and try again." },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: { detail: "Account locked. Try again in 19 minutes." },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "OTP is valid for 5 minutes. 5 failed attempts in 10 mins will lock the user for 20 mins. IP-throttled at 30 reqs/min.",
    relatedEndpoints: ["/auth/resend-otp/", "/users/register/"],
    errorHandling: [
      { status: 400, message: "Invalid, expired, or already used OTP." },
      {
        status: 429,
        message: "Account locked or IP rate-limited.",
        nextSteps: "Wait for the lockout/cooldown period to expire.",
      },
    ],
  },
  {
    id: "authentication-resend-otp",
    name: "Resend OTP",
    method: "POST",
    url: "/auth/resend-otp/",
    description: "Resend the OTP to a user’s email for account verification.",
    fullDescription: `
## 🔁 OTP Resend API

Resends the OTP to a user’s email. This is rate-limited and protected by cooldowns and lockouts.

### 📝 Request
\`\`\`json
{
  "email": "sujith94967@gmail.com"
}
\`\`\`

### ✅ Successful Response
\`\`\`json
{
  "message": "OTP resent successfully. Attempt 2/3",
  "resend_count": 2,
  "max_resend_count": 3,
  "next_resend_available": 60
}
\`\`\`

### 🛡️ Protections
- **IP Throttling**: Max 30 requests/minute.
- **Resend Attempts**: Max 3 per OTP lifetime.
- **Cooldown**: 60 seconds between resends.
- **Lockout**: 20 min lock after 3 attempts.

### ❌ Error Responses
- **400 Bad Request**: If the user is already verified or the 60s cooldown has not passed.
- **429 Too Many Requests**: If the IP rate limit is hit or the user is locked out from too many resend attempts.
`,
    authentication: "None",
    requestBody: {
      type: "json",
      example: {
        email: "sujithts94967@gmail.com",
      },
    },
    responseExamples: [
      {
        status: 200,
        description: "OK",
        body: {
          message: "OTP resent successfully. Attempt 2/3",
          resend_count: 2,
          max_resend_count: 3,
          next_resend_available: 60,
        },
      },
      {
        status: 400,
        description: "Bad Request",
        body: {
          message: "Request failed",
          errors: { wait_time: "Wait 47s before requesting another OTP." },
        },
      },
      {
        status: 429,
        description: "Too Many Requests",
        body: { detail: "Account locked. Try again in 19 minutes." },
      },
    ],
    category: "Authentication",
    technicalNotes:
      "A user can request to resend an OTP up to 3 times, with a 60-second cooldown between each request. After 3 attempts, the account is locked for 20 minutes.",
    relatedEndpoints: ["/auth/verify-otp/", "/users/register/"],
    errorHandling: [
      {
        status: 400,
        message: "User is already verified or cooldown is active.",
        nextSteps: "Wait for the cooldown period.",
      },
      {
        status: 429,
        message: "Account locked or IP rate-limited.",
        nextSteps: "Wait for the lockout/cooldown period to expire.",
      },
    ],
  },
];

export function getApiEndpoints(): EndpointData[] {
  return endpointsData;
}

export function getEndpointById(id: string): EndpointData | null {
  return endpointsData.find(endpoint => endpoint.id === id) || null;
}

export function getEndpointsByCategory(): Record<string, EndpointData[]> {
  const byCategory: Record<string, EndpointData[]> = {};

  endpointsData.forEach(endpoint => {
    if (!byCategory[endpoint.category]) {
      byCategory[endpoint.category] = [];
    }
    byCategory[endpoint.category].push(endpoint);
  });

  return byCategory;
}
