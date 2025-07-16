import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import authService from "../../api/authService";
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
import { emailSchema } from "../../validations/authSchemas";

interface ApiErrorResponse {
  detail?: string;
  email?: string[];
}

type FormData = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(data.email);
      setEmailSent(true);
      reset();
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.email?.[0] ||
        "Failed to send reset email. Please try again later.";

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessMessage = () => (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.mail
            className="mx-auto h-12 w-12 text-green-500"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a password reset link. Please check your inbox
            and follow the instructions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Sent</CardTitle>
            <CardDescription>
              Didn&apos;t receive the email? Check your spam folder or try
              resending.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                // Move focus back to the email input when going back
                setTimeout(() => {
                  const emailInput = document.getElementById("email");
                  emailInput?.focus();
                }, 0);
              }}
              aria-label="Return to password reset form"
            >
              Back to Reset
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="hover:text-brand underline underline-offset-4"
                aria-label="Navigate back to login page"
              >
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  if (emailSent) {
    return <SuccessMessage />;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
                aria-busy={isLoading}
                aria-live="polite"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="hover:text-brand underline underline-offset-4"
                  aria-label="Navigate back to login page"
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
