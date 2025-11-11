import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function RecentActivity() {
  const activities = [
    { action: "Clocked In", time: "Today at 8:00 AM", color: "text-green-400" },
    { action: "Clocked Out", time: "Yesterday at 5:30 PM", color: "text-gray-400" },
    { action: "Clocked In", time: "Yesterday at 8:15 AM", color: "text-green-400" },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    activity.color.replace("text", "bg")
                  )}
                />
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
