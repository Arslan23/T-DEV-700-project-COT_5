import { Card, CardAction } from '../ui/card'
import { Clock, Users, TrendingUp, Calendar, AlertCircle, UsersRound } from "lucide-react";


const StatsCard = () => {
    const weeklyHours = 40.5;
    const todayHours = 8.2;
    return (
        <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-6 h-[26rem]">
            <div className="flex-between mb-4">
                <h2 className="text-xl font-bold text-white">Stats</h2>
                <CardAction className="bg-slate-800 border-slate-700 text-white rounded-lg px-4 py-2">
                    <select className="cursor-pointer bg-slate-800 border-slate-700 text-white rounded-lg px-4 py-2">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </CardAction>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-6">
                    <div className="flex-between mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">+5%</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Weekly Hours</p>
                    <p className="text-3xl font-bold text-white">{weeklyHours}h</p>
                </Card>

                <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/20 backdrop-blur p-6">
                    <div className="flex-between mb-4">
                        <div className="bg-pink-500/20 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-pink-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Today</p>
                    <p className="text-3xl font-bold text-white">{todayHours}h</p>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/20 backdrop-blur p-6">
                    <div className="flex-between mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Average/Day</p>
                    <p className="text-3xl font-bold text-white">8.1h</p>
                </Card>
            </div>
        </div>
    )
}

export default StatsCard