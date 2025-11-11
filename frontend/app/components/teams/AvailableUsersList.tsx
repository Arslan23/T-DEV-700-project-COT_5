import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Plus } from "lucide-react";
import type { User } from "types/user.types";

interface AvailableUsersListProps {
  isLoading: boolean;
  users: User[] | undefined;
  onAddMember: (userId: string) => void;
}

export function AvailableUsersList({ isLoading, users, onAddMember }: AvailableUsersListProps) {
  if (isLoading) {
    return (
      <div className="flex-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className="text-center py-8 text-gray-500">No users found</p>;
  }

  return (
    <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-700 rounded-lg p-2 bg-slate-800/50">
      {users.map((user) => (
        <button
          key={user.id}
          type="button"
          onClick={() => onAddMember(user.id)}
          className="w-full flex-between p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
        >
          <div className="flex-v-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white font-semibold">
              {/* {user.name[0]} */} JJ
            </div>
            <div>
              <p className="text-white font-medium">
                {/* {user.name}  */}
                JJK
              </p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <Plus className="w-5 h-5 text-purple-400" />
        </button>
      ))}
    </div>
  );
}
