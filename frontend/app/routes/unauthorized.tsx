import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex-center p-4">
      <div className="text-center">
        <div className="inline-flex-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          You don't have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}