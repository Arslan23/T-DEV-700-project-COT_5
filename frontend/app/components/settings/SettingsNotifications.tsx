import { Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import getNotificationDescription from "./getNotificationDescription";
import { useState } from "react";

export default function SettingsNotifications({ notifications, setNotifications, setShowSuccess }: any) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <span className="w-5 h-5 text-purple-400">🔔</span>
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex-between py-3 border-b border-slate-700 last:border-0">
            <div>
              <p className="text-white font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm text-gray-400">
                {getNotificationDescription(key)}
              </p>
            </div>
            <label className="relative inline-flex-v-center cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => {
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all flex-v-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Preferences
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
