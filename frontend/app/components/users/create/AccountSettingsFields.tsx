import { Briefcase } from "lucide-react";
import type { UserRole } from "types/user.types";

interface AccountSettingsFieldsProps {
  formData: {
    role: UserRole;
    is_active: boolean;
  };
  setFormData: (data: any) => void;
  isAdmin: boolean;
}

export function AccountSettingsFields({ formData, setFormData, isAdmin }: AccountSettingsFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Role - Only admin can assign manager/admin role */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Role <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!isAdmin}
          >
            <option value="employee">Employee</option>
            {isAdmin && <option value="manager">Manager</option>}
            {isAdmin && <option value="company_admin">Company Admin</option>}
          </select>
        </div>
        {!isAdmin && (
          <p className="mt-2 text-sm text-gray-500">
            Only administrators can assign manager or admin roles
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Status
        </label>
        <select
          value={String(formData.is_active)}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.value === "true" })
          }
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  );
}