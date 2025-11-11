import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "~/lib/utils";

interface PasswordFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  setErrors: (errors: any) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

export function PasswordFields({
  formData,
  setFormData,
  errors,
  setErrors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: PasswordFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: undefined });
            }}
            className={cn(
              "w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
              errors.password ? "border-red-500/50" : "border-slate-700"
            )}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-400">{errors.password}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Password must be at least 8 characters long
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: undefined });
            }}
            className={cn(
              "w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
              errors.confirmPassword ? "border-red-500/50" : "border-slate-700"
            )}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
}
