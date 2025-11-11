import { Sun, Moon, Clock, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export default function SettingsPreferences({ preferences, setPreferences, setShowSuccess }: any) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <span className="w-5 h-5 text-purple-400"><Moon /></span>
          Application Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPreferences({ ...preferences, theme: "light" })}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                preferences.theme === "light"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              )}
            >
              <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-medium">Light</p>
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, theme: "dark" })}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                preferences.theme === "dark"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              )}
            >
              <Moon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">Dark</p>
            </button>
          </div>
        </div>
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Timezone
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Africa/Porto-Novo">Cotonou (WAT)</option>
            </select>
          </div>
        </div>
        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
          </select>
        </div>
        {/* Time Format */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Format
          </label>
          <select
            value={preferences.timeFormat}
            onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="12h">12-hour (3:30 PM)</option>
            <option value="24h">24-hour (15:30)</option>
          </select>
        </div>
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
