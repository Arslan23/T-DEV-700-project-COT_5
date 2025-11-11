import { useState } from "react";
import { Form, useActionData, useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { useAppDispatch } from "~/hooks/redux";
import { updateUser } from "~/store/slices/authSlice";
import { useUpdateUserProfileMutation } from "~/store/services/usersApi";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import {
  User,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Clock,
  Shield,
  Save,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/_auth.settings";
import SettingsProfile from "../components/settings/SettingsProfile";
import SettingsSecurity from "../components/settings/SettingsSecurity";
import SettingsNotifications from "../components/settings/SettingsNotifications";
import SettingsPreferences from "../components/settings/SettingsPreferences";
import SettingsAdmin from "../components/settings/SettingsAdmin";

// Server-side action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const section = formData.get("section") as string;

  // Handle different sections
  if (section === "profile") {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    // Validate and update profile
    // ... your backend logic
    return { success: "Profile updated successfully" };
  }

  if (section === "password") {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // Update password
    // ... your backend logic
    return { success: "Password updated successfully" };
  }

  return { error: "Invalid request" };
}

export default function Settings() {
  const { user, isAdmin, isManager } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "preferences" | "company_admin">("profile");
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [profileErrors, setProfileErrors] = useState<any>({});

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    clockReminders: true,
    teamUpdates: true,
    weeklyReports: false,
    systemAlerts: true,
  });

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: any = {};
    if (!profileData.name.trim()) errors.firstName = "Name is required";
    if (!profileData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    try {
      await updateUserProfile({ id: user!.id, data: profileData }).unwrap();
      dispatch(updateUser(profileData));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      setProfileErrors({ general: error?.data?.message || "Failed to update profile" });
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: any = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) errors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      // Call API to update password
      // await updatePassword(passwordData).unwrap();
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      setPasswordErrors({ general: error?.data?.message || "Failed to update password" });
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "profile", label: "Profile", icon: User, roles: ["employee", "manager", "company_admin"] },
    { id: "security", label: "Security", icon: Lock, roles: ["employee", "manager", "company_admin"] },
    { id: "notifications", label: "Notifications", icon: Bell, roles: ["employee", "manager", "company_admin"] },
    { id: "preferences", label: "Preferences", icon: Globe, roles: ["employee", "manager", "company_admin"] },
    { id: "company_admin", label: "Admin Settings", icon: Shield, roles: ["company_admin"] },
  ].filter(tab => tab.roles.includes(user?.role || "employee"));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex-v-center gap-3">
          <Check className="w-5 h-5 text-green-400" />
          <p className="text-green-400">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:col-span-1 bg-slate-900/50 border-slate-700/50 backdrop-blur h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "w-full flex-v-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                      activeTab === tab.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <SettingsProfile user={user} isUpdating={isUpdating} updateUserProfile={updateUserProfile} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
          )}
          {activeTab === "security" && (
            <SettingsSecurity isUpdating={isUpdating} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
          )}
          {activeTab === "notifications" && (
            <SettingsNotifications notifications={notifications} setNotifications={setNotifications} setShowSuccess={setShowSuccess} />
          )}
          {activeTab === "preferences" && (
            <SettingsPreferences preferences={preferences} setPreferences={setPreferences} setShowSuccess={setShowSuccess} />
          )}
          {activeTab === "company_admin" && isAdmin() && (
            <SettingsAdmin setShowSuccess={setShowSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}