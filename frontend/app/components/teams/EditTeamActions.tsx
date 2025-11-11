import { cn } from "~/lib/utils";
import { Loader2, Save } from "lucide-react";

interface EditTeamActionsProps {
  onCancel: () => void;
  isUpdating: boolean;
  showSuccess: boolean;
}

export function EditTeamActions({ onCancel, isUpdating, showSuccess }: EditTeamActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        disabled={isUpdating}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isUpdating || showSuccess}
        className={cn(
          "px-6 py-3 rounded-lg font-medium text-white transition-all",
          "bg-gradient-to-r from-purple-600 to-blue-600",
          "hover:from-purple-500 hover:to-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center gap-2"
        )}
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving Changes...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}
