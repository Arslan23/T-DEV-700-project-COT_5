import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex-center text-center p-4">
      <div>
        <h1 className="text-6xl font-bold text-purple-500">404</h1>
        <h2 className="text-3xl font-semibold text-white mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link 
          to="/dashboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}