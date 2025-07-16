import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/authStore";
import { changePasswordSchema } from "@/validations/authSchemas";

type SettingsFormValues = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

interface SettingsProps {
  onThemeChange?: (theme: string) => void;
  showPasswordOnly?: boolean;
}

export const Settings = ({
  onThemeChange,
  showPasswordOnly = false,
}: SettingsProps) => {
  const { changePassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme || "system");

  useEffect(() => {
    setCurrentTheme(theme || "system");
  }, [theme]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    setTheme(theme);
    // Call the optional onThemeChange callback if provided
    onThemeChange?.(theme);
  };

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      await changePassword(
        data.old_password,
        data.new_password,
        data.confirm_password
      );
      toast.success("Password changed successfully!", {
        description: "Your password has been updated securely.",
        icon: <CheckCircle className="w-4 h-4" />,
      });
      reset();
    } catch (error: unknown) {
      console.error("Failed to change password:", error);

      const axiosError = error as {
        response?: {
          data?: { error?: Record<string, string[]>; detail?: string };
        };
      };
      const errorData = axiosError.response?.data;
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (errorData) {
        if (errorData.error && typeof errorData.error === "object") {
          const errorFields = Object.keys(errorData.error);
          if (errorFields.length > 0) {
            const firstErrorField = errorFields[0];
            if (
              errorData.error[firstErrorField] &&
              Array.isArray(errorData.error[firstErrorField]) &&
              errorData.error[firstErrorField].length > 0
            ) {
              errorMessage = errorData.error[firstErrorField][0];
            }
          }
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }

      toast.error("Password Change Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getThemeDescription = (theme: string) => {
    switch (theme) {
      case "light":
        return "Light mode with bright colors";
      case "dark":
        return "Dark mode with reduced eye strain";
      default:
        return "Automatically follows your system preference";
    }
  };

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <div className="relative">
            <Input
              type={showPasswords.old ? "text" : "password"}
              id="oldPassword"
              {...register("old_password")}
              disabled={isLoading}
              placeholder="Enter your current password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("old")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.old ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.old_password && (
            <p className="text-sm text-destructive flex items-center space-x-1">
              <span>{errors.old_password.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              type={showPasswords.new ? "text" : "password"}
              id="newPassword"
              {...register("new_password")}
              disabled={isLoading}
              placeholder="Enter your new password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.new ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-sm text-destructive flex items-center space-x-1">
              <span>{errors.new_password.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              id="confirmPassword"
              {...register("confirm_password")}
              disabled={isLoading}
              placeholder="Confirm your new password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-sm text-destructive flex items-center space-x-1">
              <span>{errors.confirm_password.message}</span>
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderThemeSection = () => (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Theme Preferences</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["system", "light", "dark"].map(theme => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  currentTheme === theme
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                {getThemeIcon(theme)}
                <span className="font-medium capitalize">{theme}</span>
                {currentTheme === theme && (
                  <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getThemeDescription(theme)}
              </p>
            </button>
          ))}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">Current Theme</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You are currently using{" "}
            <span className="font-medium">{currentTheme}</span> theme.
            {currentTheme === "system" &&
              " This will automatically switch between light and dark modes based on your system preferences."}
          </p>
        </div>
      </div>
    </div>
  );

  if (showPasswordOnly) {
    return <div className="max-w-md mx-auto">{renderPasswordSection()}</div>;
  }

  return <div className="space-y-8">{renderThemeSection()}</div>;
};
