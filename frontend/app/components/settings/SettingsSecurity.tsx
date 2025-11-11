import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";

export default function SettingsSecurity({ isUpdating, showSuccess, setShowSuccess }: any) {
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // await updatePassword(passwordData).unwrap();
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      setPasswordErrors({ general: error?.data?.message || "Failed to update password" });
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, currentPassword: e.target.value });
                  setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                }}
                className={cn(
                  "w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500",
                  passwordErrors.currentPassword ? "border-red-500/50" : "border-slate-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-2 text-sm text-red-400">{passwordErrors.currentPassword}</p>
            )}
          </div>
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, newPassword: e.target.value });
                  setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                }}
                className={cn(
                  "w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500",
                  passwordErrors.newPassword ? "border-red-500/50" : "border-slate-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-2 text-sm text-red-400">{passwordErrors.newPassword}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                }}
                className={cn(
                  "w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500",
                  passwordErrors.confirmPassword ? "border-red-500/50" : "border-slate-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-2 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          {/* Two-Factor Authentication */}
          <div className="pt-6 border-t border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all flex-v-center gap-2"
            >
              <Save className="w-5 h-5" />
              Update Password
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
