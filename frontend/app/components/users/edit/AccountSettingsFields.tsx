import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Briefcase } from "lucide-react";

interface AccountSettingsFieldsProps {
    formData: {
        role: string;
        is_active: boolean;
    };
    handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isAdmin: boolean;
}

export function AccountSettingsFields({ formData, handleSelectChange, isAdmin }: AccountSettingsFieldsProps) {
    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Account Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleSelectChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={!isAdmin}
                        >
                            <option value="employee">Employee</option>
                            {isAdmin && <option value="manager">Manager</option>}
                            {isAdmin && <option value="company_admin">Administrator</option>}
                        </select>
                    </div>
                    {!isAdmin && (
                        <p className="mt-2 text-sm text-gray-500">
                            Only administrators can change user roles
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                    </label>
                    <select
                        name="is_active"
                        value={String(formData.is_active)}
                        onChange={handleSelectChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                        Inactive users cannot log in to the system
                    </p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-400 text-sm">
                        <strong>Note:</strong> To change the password, use the "Reset Password" feature or contact the user to change it from their settings.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}