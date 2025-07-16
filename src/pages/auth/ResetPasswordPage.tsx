import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { publicAxios } from "../../api/axios";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Icons } from "../../components/ui/icons";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { resetPasswordSchema } from "../../validations/authSchemas";

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Set link as valid if both uidb64 and token are present
  useEffect(() => {
    if (uidb64 && token) {
      setIsValidLink(true);
    } else {
      setIsValidLink(false);
    }
  }, [uidb64, token]);

  const onSubmit = async (data: FormData) => {
    if (!uidb64 || !token) return;

    setIsLoading(true);

    try {
      // Use publicAxios to avoid auth token being sent
      const response = await publicAxios.post(
        `/auth/reset-password/${uidb64}/${token}/`,
        {
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false, // Explicitly disable credentials
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Password reset successful!");
        navigate("/login", { state: { passwordReset: true } });
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            detail?: string;
            errors?: {
              non_field_errors?: string[];
            };
          };
        };
      };

      const errorData = axiosError.response?.data;

      if (axiosError.response?.status === 429) {
        // Handle rate limiting or account lockout
        toast.error(
          errorData?.detail || "Too many attempts. Please try again later."
        );
      } else if (axiosError.response?.status === 400) {
        // Handle validation errors or invalid token
        const errorMessage =
          errorData?.detail ||
          errorData?.errors?.non_field_errors?.[0] ||
          "Failed to reset password. Please check your input and try again.";
        toast.error(errorMessage);
      } else {
        // Generic error
        toast.error(
          errorData?.detail ||
            "Failed to reset password. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidLink === null) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.alertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Invalid or Expired Link
            </h1>
            <p className="text-sm text-muted-foreground">
              The password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>

          <Card>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button asChild className="w-full">
                <Link to="/forgot-password">Request New Reset Link</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Create a strong, unique password</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("new_password")}
                />
                {errors.new_password && (
                  <p className="text-sm text-destructive">
                    {errors.new_password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase,
                  number, and special character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-destructive">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>

              <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
