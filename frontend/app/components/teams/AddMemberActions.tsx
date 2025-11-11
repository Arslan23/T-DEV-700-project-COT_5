import { Card } from "~/components/ui/card";
import { UserSearchInput } from "./UserSearchInput";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { UserPlus } from "lucide-react";
import { cn } from "~/lib/utils";

interface AddMemberActionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectAll: () => void;
  onAddMembers: () => void;
  selectedCount: number;
  isAdding: boolean;
  isAllSelected: boolean;
}

export function AddMemberActions({
  searchQuery,
  setSearchQuery,
  onSelectAll,
  onAddMembers,
  selectedCount,
  isAdding,
  isAllSelected,
}: AddMemberActionsProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <UserSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
          <button
            onClick={onAddMembers}
            disabled={selectedCount === 0 || isAdding}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              "bg-gradient-to-r from-purple-600 to-blue-600",
              "hover:from-purple-500 hover:to-blue-500",
              "text-white disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2"
            )}
          >
            {isAdding ? (
              <>
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add {selectedCount > 0 ? `(${selectedCount})` : "Members"}
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
