import { useState } from "react";
import { useAppDispatch } from "~/hooks/redux";
import { updateUser } from "~/store/slices/authSlice";
import { Mail, Briefcase } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Save } from "lucide-react";
import { cn } from "~/lib/utils";

export default function SettingsProfile({ user, isUpdating, updateUserProfile, showSuccess, setShowSuccess }: any) {
  const dispatch = useAppDispatch();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [profileErrors, setProfileErrors] = useState<any>({});

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <span className="w-5 h-5 text-purple-400"><Mail /></span>
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex-v-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white text-2xl font-bold">
              {profileData.name[0]}
            </div>
            <div>
              <p className="text-white font-medium mb-1">Profile Picture</p>
              <p className="text-sm text-gray-400 mb-3">JPG, PNG or GIF. Max size 2MB</p>
              <button
                type="button"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
              >
                Upload Photo
              </button>
            </div>
          </div>
          {/* Name Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => {
                  setProfileData({ ...profileData, name: e.target.value });
                  setProfileErrors({ ...profileErrors, name: undefined });
                }}
                className={cn(
                  "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500",
                  profileErrors.firstName ? "border-red-500/50" : "border-slate-700"
                )}
              />
              {profileErrors.firstName && (
                <p className="mt-2 text-sm text-red-400">{profileErrors.firstName}</p>
              )}
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => {
                  setProfileData({ ...profileData, email: e.target.value });
                  setProfileErrors({ ...profileErrors, email: undefined });
                }}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500",
                  profileErrors.email ? "border-red-500/50" : "border-slate-700"
                )}
              />
            </div>
            {profileErrors.email && (
              <p className="mt-2 text-sm text-red-400">{profileErrors.email}</p>
            )}
          </div>
          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <div className="flex-v-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <Badge variant={user?.role === "company_admin" ? "default" : user?.role === "manager" ? "info" : "default"}>
                {user?.role?.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500 ml-2">Contact admin to change your role</span>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className={cn(
                "px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600",
                "hover:from-purple-500 hover:to-blue-500",
                "text-white rounded-lg font-medium transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex-v-center gap-2"
              )}
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
