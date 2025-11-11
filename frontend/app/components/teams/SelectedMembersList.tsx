import { X } from "lucide-react";
import type { User } from "types/user.types";

interface SelectedMembersListProps {
  users: User[];
  onRemoveMember: (userId: string) => void;
}

export function SelectedMembersList({ users, onRemoveMember }: SelectedMembersListProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-300 mb-3">Selected Members:</p>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex-between p-3 bg-slate-800 border border-slate-700 rounded-lg"
          >
            <div className="flex-v-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white font-semibold">
                {/* {user.name[0]} */} JJM
              </div>
              <div>
                <p className="text-white font-medium">
                  {/* {user.name} */} JJL                
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemoveMember(user.id)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
