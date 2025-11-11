import { Card } from "~/components/ui/card";
import { Users, UserPlus, Calendar } from "lucide-react";
import type { Team } from "types/team.types";

interface TeamStatsProps {
  teams: Team[];
}

export function TeamStats({ teams }: TeamStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-6">
        <div className="flex-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Teams</p>
            <p className="text-3xl font-bold text-white">{teams?.length || 0}</p>
          </div>
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-6">
        <div className="flex-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Active Teams</p>
            <p className="text-3xl font-bold text-white">
              {teams?.filter((t) => t.status === "active").length || 0}
            </p>
          </div>
          <div className="bg-green-500/20 p-3 rounded-lg">
            <UserPlus className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 backdrop-blur p-6">
        <div className="flex-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Members</p>
            <p className="text-3xl font-bold text-white">
              {teams?.reduce((acc, team) => acc + (team.members_detail?.length || 0), 0) || 0}
            </p>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 backdrop-blur p-6">
        <div className="flex-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Avg Team Size</p>
            <p className="text-3xl font-bold text-white">
              {teams?.length
                ? Math.round(teams.reduce((acc, team) => acc + (team.members_detail?.length || 0), 0) / teams.length)
                : 0}
            </p>
          </div>
          <div className="bg-orange-500/20 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}
