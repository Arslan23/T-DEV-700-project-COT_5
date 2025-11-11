import { useAuth } from "~/hooks/useAuth";
import { Card } from "~/components/ui/card";
import { Clock, Users, TrendingUp, AlertCircle, UsersRound } from "lucide-react";
import StatsCard from "~/components/dashboard/StatsCard";
import WorkHoursChart from "~/components/dashboard/WorkHoursChart";
import { Calendar } from "~/components/ui/calendar"; // Adjust import path if needed


function EmployeeDashboard() {

  return (
    <section className="p-8 space-y-6 flex gap-8">
      <div className="flex-1 space-y-6">
        <StatsCard />
        <WorkHoursChart />
      </div>

      {/* Right Section */}
      <aside className="w-[350px] flex flex-col gap-6">
        {/* First Row: Calendar */}
        <div className="bg-slate-900 rounded-lg p-4 h-[26rem]">
          <Calendar mode="single" className="bg-[#0a0a0a] text-white w-full"/>
        </div>
        {/* Second Row: Add your content here */}
        <div className="bg-slate-900 rounded-lg p-4 h-40 flex-center">
          {/* Placeholder for second row */}
          <span className="text-gray-400">Second row content</span>
        </div>
      </aside>
    </section>
  );
}

function ManagerDashboard() {
  const { user } = useAuth();

  const teamStats = {
    lateRate: 15,
    absenceRate: 8,
    overtimeRate: 22,
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Manager Dashboard - {user?.firstname} {user?.lastname}</h1>

      {/* KPI Cards - Like your design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/20 backdrop-blur p-6">
          <div className="flex-between mb-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-2xl text-red-400">↓</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">Late Rate</p>
          <p className="text-3xl font-bold text-white">{teamStats.lateRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{(teamStats.lateRate * 0.8).toFixed(1)} hours</p>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/20 backdrop-blur p-6">
          <div className="flex-between mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-1">Absence Rate</p>
          <p className="text-3xl font-bold text-white">{teamStats.absenceRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{(teamStats.absenceRate * 0.5).toFixed(1)} hours</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-6">
          <div className="flex-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl text-green-400">↑</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">Overtime Rate</p>
          <p className="text-3xl font-bold text-white">{teamStats.overtimeRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{(teamStats.overtimeRate * 1.2).toFixed(1)} hours</p>
        </Card>
      </div>

      {/* Team Performance Chart */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-6">
        <h2 className="text-xl font-bold text-white mb-6">Team Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm text-gray-400 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {[
                { name: "John Doe", hours: 45, color: "bg-green-500" },
                { name: "Jane Smith", hours: 43, color: "bg-blue-500" },
                { name: "Bob Johnson", hours: 41, color: "bg-purple-500" },
              ].map((person) => (
                <div key={person.name} className="flex-v-center gap-3">
                  <div className="w-full bg-slate-800 rounded-lg p-3">
                    <div className="flex-between items-center mb-2">
                      <span className="text-white text-sm">{person.name}</span>
                      <span className="text-gray-400 text-sm">{person.hours}h</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`${person.color} h-2 rounded-full`}
                        style={{ width: `${(person.hours / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-4">Alerts</h3>
            <div className="space-y-2">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">3 late arrivals this week</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">2 pending time-off requests</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard - {user?.name}</h1>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-6">
          <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">156</p>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 backdrop-blur p-6">
          <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
            <UsersRound className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Teams</p>
          <p className="text-3xl font-bold text-white">12</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-6">
          <div className="bg-green-500/20 p-3 rounded-lg w-fit mb-4">
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Active Today</p>
          <p className="text-3xl font-bold text-white">142</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 backdrop-blur p-6">
          <div className="bg-orange-500/20 p-3 rounded-lg w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Avg Hours/Week</p>
          <p className="text-3xl font-bold text-white">41.2h</p>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "New user registered", user: "John Doe", time: "5 min ago" },
              { action: "Team created", user: "Jane Smith", time: "15 min ago" },
              { action: "User role updated", user: "Bob Johnson", time: "1 hour ago" },
            ].map((activity, i) => (
              <div key={i} className="flex-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user}</p>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
          <div className="space-y-4">
            {[
              { metric: "Database", status: "Operational", color: "bg-green-500" },
              { metric: "API", status: "Operational", color: "bg-green-500" },
              { metric: "Background Jobs", status: "Running", color: "bg-blue-500" },
            ].map((health) => (
              <div key={health.metric} className="flex-between">
                <span className="text-gray-300">{health.metric}</span>
                <div className="flex-v-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${health.color}`} />
                  <span className="text-sm text-gray-400">{health.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Main Dashboard Component - Routes to correct dashboard based on role
export default function Dashboard() {
  const { user, isAdmin, isManager } = useAuth();

  if (!user) return null;

  // Render different dashboard based on role
  if (isAdmin()) {
    return <AdminDashboard />;
  }

  if (isManager()) {
    return <ManagerDashboard />;
  }

  return <EmployeeDashboard />;
}

// Optional: Server-side loader for pre-fetching role-specific data
// export async function loader({ request }: { request: Request }) {
//   // You could fetch role-specific data here if needed
//   return {};
// }