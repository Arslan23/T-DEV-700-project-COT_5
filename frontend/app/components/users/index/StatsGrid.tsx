import { Card } from "~/components/ui/card";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

interface StatsGridProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    users: number;
    managers: number;
  };
  isAdmin: boolean;
}

export function StatsGrid({ stats, isAdmin }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <Users className="w-8 h-8 text-purple-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 border-gray-500/20 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-white">{stats.inactive}</p>
          </div>
          <UserX className="w-8 h-8 text-gray-400" />
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Employees</p>
            <p className="text-2xl font-bold text-white">{stats.users}</p>
          </div>
          <UserPlus className="w-8 h-8 text-blue-400" />
        </div>
      </Card>

      {isAdmin && (
        <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Managers</p>
              <p className="text-2xl font-bold text-white">{stats.managers}</p>
            </div>
            <Users className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
      )}
    </div>
  );
}
