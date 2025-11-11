import { Card, CardAction } from "~/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WorkHoursChart = () => {
    const stats = [
        { day: "Mon", hours: 8 },
        { day: "Tue", hours: 7.5 },
        { day: "Wed", hours: 8 },
        { day: "Thu", hours: 9 },
        { day: "Fri", hours: 8 },
    ];

    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-6">
            <div className="flex-between mb-6">
                <h2 className="text-xl font-bold text-white">Work Hours Chart</h2>
                <CardAction className="bg-slate-800 border-slate-700 text-white rounded-lg px-4 py-2">
                    <select className="cursor-pointer bg-slate-800 border-slate-700 text-white rounded-lg px-4 py-2">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </CardAction>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default WorkHoursChart