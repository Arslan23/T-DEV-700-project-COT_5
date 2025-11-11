import { cn } from "~/lib/utils";
import { Loader2, Save } from "lucide-react";

interface CreateTeamActionsProps {
  onCancel: () => void;
  isCreating: boolean;
  showSuccess: boolean;
}

export function CreateTeamActions({ onCancel, isCreating, showSuccess }: CreateTeamActionsProps) {
  return (
    <div className="flex-v-center justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
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
          "flex-v-center gap-2 cursor-pointer"
        )}
      >
        {isCreating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Team...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Create Team
          </>
        )}
      </button>
    </div>
  );
}
