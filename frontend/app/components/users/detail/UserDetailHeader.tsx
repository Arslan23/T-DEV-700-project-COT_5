import { Link } from "react-router";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { User } from "types/user.types";

interface UserDetailHeaderProps {
  user: User;
  id: string;
  onBack: () => void;
  onDelete: () => void;
}

export function UserDetailHeader({ user, id, onBack, onDelete }: UserDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {user.firstname} {user.lastname}
            </h1>
            <Badge variant={user.is_active ? "success" : "default"}>
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={`/manager/users/${id}/edit`}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
