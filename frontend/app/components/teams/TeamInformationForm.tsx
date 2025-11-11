import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface TeamInformationFormProps {
  formData: {
    name: string;
    description: string;
    status: string;
  };
  setFormData: (data: any) => void;
  errors: { name?: string; description?: string };
  setErrors: (errors: any) => void;
}

export function TeamInformationForm({ formData, setFormData, errors, setErrors }: TeamInformationFormProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Team Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Team Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: undefined });
            }}
            className={cn(
              "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              errors.name ? "border-red-500/50" : "border-slate-700"
            )}
            placeholder="e.g., Development Team, Sales Team"
            maxLength={100}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400 flex-v-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: undefined });
            }}
            rows={4}
            className={cn(
              "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none",
              errors.description ? "border-red-500/50" : "border-slate-700"
            )}
            placeholder="Describe the team's purpose, goals, or responsibilities..."
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-sm text-red-400 flex-v-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
