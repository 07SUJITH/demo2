import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

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
import { useAuth } from "../../store/authStore";
import { otpVerificationSchema } from "../../validations/authSchemas";

type FormData = z.infer<typeof otpVerificationSchema>;

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState("");
  const { verifyOtp, resendOtp, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or redirect
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      navigate("/register");
      return;
    }
    setEmail(emailFromState);
  }, [location.state, navigate]);

  // Automatically send OTP when page loads with email from login redirect
  useEffect(() => {
    const sendInitialOtp = async () => {
      if (email && location.state?.message) {
        // Only auto-send if coming from login redirect (has message)
        try {
          await resendOtp(email);
          setResendCooldown(60); // Start cooldown
          toast.success("OTP sent to your email");
        } catch (err) {
          console.error("Auto OTP send error:", err);
          // Don't show error toast for auto-send, user can manually resend
        }
      }
    };

    if (email && location.state?.message) {
      sendInitialOtp();
    }
  }, [email, location.state?.message, resendOtp]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!email) return;

    setIsLoading(true);
    clearError();

    try {
      await verifyOtp(email, data.otp);
      toast.success("Email verified successfully!");

      // Add a small delay for better user experience
      await new Promise(resolve => setTimeout(resolve, 1500));

      navigate("/login", { state: { email } });
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendCooldown > 0) return;

    setResendLoading(true);

    try {
      await resendOtp(email);
      setResendCooldown(60); // 60 seconds cooldown
      toast.success("New OTP sent to your email");
    } catch (err) {
      console.error("Resend OTP error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Required
            </h1>
            <p className="text-sm text-muted-foreground">
              Please register first to receive a verification code.
            </p>
          </div>
          <Button asChild>
            <Link to="/register">Go to Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              Check your email for the 6-digit code
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  disabled={isLoading}
                  {...register("otp")}
                />
                {errors.otp && (
                  <p className="text-sm text-destructive">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Didn&apos;t receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading || resendCooldown > 0}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <Icons.spinner className="mr-2 inline h-4 w-4 animate-spin" />
                    ) : resendCooldown > 0 ? (
                      `Resend in ${resendCooldown}s`
                    ) : (
                      "Resend code"
                    )}
                  </button>
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify Email
              </Button>

              <p className="px-8 text-center text-sm text-muted-foreground">
                <span>Wrong email? </span>
                <Link
                  to="/register"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Go back
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
