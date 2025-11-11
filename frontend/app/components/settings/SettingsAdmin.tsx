import { AlertCircle, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export default function SettingsAdmin({ setShowSuccess }: any) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-v-center gap-2">
          <span className="w-5 h-5 text-purple-400">🛡️</span>
          Administrator Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg">System Configuration</h3>
          <div className="flex-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-400">Temporarily disable access for all non-admin users</p>
            </div>
            <label className="relative inline-flex-v-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white font-medium">User Registration</p>
              <p className="text-sm text-gray-400">Allow managers to create new user accounts</p>
            </div>
            <label className="relative inline-flex-v-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Send system-wide email notifications to users</p>
            </div>
            <label className="relative inline-flex-v-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
        {/* Working Hours Configuration */}
        <div className="space-y-4 pt-6 border-t border-slate-700">
          <h3 className="text-white font-semibold text-lg">Working Hours Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Daily Target (hours)</label>
              <input type="number" defaultValue={8} min={1} max={24} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weekly Target (hours)</label>
              <input type="number" defaultValue={40} min={1} max={168} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Standard Start Time</label>
              <input type="time" defaultValue="08:00" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Standard End Time</label>
              <input type="time" defaultValue="17:00" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
        </div>
        {/* Data Management */}
        <div className="space-y-4 pt-6 border-t border-slate-700">
          <h3 className="text-white font-semibold text-lg">Data Management</h3>
          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium mb-1">Export System Data</p>
              <p className="text-sm text-gray-400 mb-3">Download all system data including users, teams, and time records</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">Export Data</button>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium mb-1">Danger Zone</p>
              <p className="text-sm text-gray-400 mb-3">Permanently delete all data. This action cannot be undone.</p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">Delete All Data</button>
            </div>
          </div>
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
            Save Admin Settings
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
