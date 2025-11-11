import { Save } from "lucide-react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";

export function FormActions({ onCancel, isCreating, showSuccess }: {
  onCancel: () => void;
  isCreating: boolean;
  showSuccess: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        disabled={isCreating}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isCreating || showSuccess}
        className={cn(
          "px-6 py-3 rounded-lg font-medium text-white transition-all",
          "bg-gradient-to-r from-purple-600 to-blue-600",
          "hover:from-purple-500 hover:to-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center gap-2"
        )}
      >
        {isCreating ? (
          <>
            <LoadingSpinner size="sm" />
            Creating User...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Create User
          </>
        )}
      </button>
    </div>
  );
}
