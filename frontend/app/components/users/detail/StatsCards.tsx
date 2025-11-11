import { Card } from "~/components/ui/card";
import { Clock, TrendingUp, Calendar } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-1">This Week</p>
        <p className="text-3xl font-bold text-white">40h</p>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-500/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-1">This Month</p>
        <p className="text-3xl font-bold text-white">168h</p>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 backdrop-blur p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-1">Average/Day</p>
        <p className="text-3xl font-bold text-white">8.2h</p>
      </Card>
    </div>
  );
}
