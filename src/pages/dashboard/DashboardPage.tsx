import {
  Calendar,
  Home,
  Lock,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  ShieldCheck,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Settings } from "@/components/settings/Settings";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/store/authStore";

type ActiveView = "dashboard" | "settings" | "profile" | "change-password";

export const DashboardPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    // Persist activeView in localStorage to prevent reset during re-renders
    const savedView = localStorage.getItem("dashboard-active-view");
    return (savedView as ActiveView) || "dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update localStorage whenever activeView changes
  useEffect(() => {
    localStorage.setItem("dashboard-active-view", activeView);
  }, [activeView]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [logout, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 "></div>
      </div>
    );
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load user profile</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: Home,
      description: "Overview and activity",
    },
    {
      id: "profile",
      name: "Profile",
      icon: UserCircle,
      description: "Personal information",
    },
    {
      id: "settings",
      name: "Settings",
      icon: SettingsIcon,
      description: "App preferences",
    },
    {
      id: "change-password",
      name: "Change Password",
      icon: Lock,
      description: "Security settings",
    },
  ];

  const renderMainContent = () => {
    switch (activeView) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-card dark:bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{user.email}</h4>
                    <p className="text-sm text-muted-foreground">
                      Member since {formatDate(user.date_joined)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">Status</p>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {user.is_verified ? "Verified" : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-card dark:bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Application Settings
              </h3>
              <Settings />
            </div>
          </div>
        );
      case "change-password":
        return (
          <div className="space-y-6">
            <div className="bg-card dark:bg-card p-6 rounded-lg shadow">
              <Settings showPasswordOnly />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-card dark:bg-card p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Login Activity</p>
                    <p className="text-sm text-muted-foreground">
                      Last login: {formatDate(user.last_login)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Account Verified</p>
                    <p className="text-sm text-muted-foreground">
                      Your account is verified and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggleButton />
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="sm:hidden"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-72 flex-shrink-0 overflow-y-auto flex flex-col`}
        >
          <div className="p-4 flex-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {formatDate(user.date_joined)}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map(item => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    setActiveView(item.id as ActiveView);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </Button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{renderMainContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
