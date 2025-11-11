import { Link } from "react-router";
import { Plus, Download, Trash2 } from "lucide-react";

interface ManageUsersHeaderProps {
  selectedUsersCount: number;
  onExport: () => void;
  onBulkDelete: () => void;
  isAdmin: boolean;
}

export function ManageUsersHeader({
  selectedUsersCount,
  onExport,
  onBulkDelete,
  isAdmin,
}: ManageUsersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
        <p className="text-gray-400 mt-1">
          {isAdmin ? "Manage all users in the system" : "Manage employees in your teams"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {selectedUsersCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedUsersCount})
          </button>
        )}
        <button
          onClick={onExport}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <Link
          to="/manager/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add User
        </Link>
      </div>
    </div>
  );
}
