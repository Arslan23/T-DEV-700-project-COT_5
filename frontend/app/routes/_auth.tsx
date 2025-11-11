import { Outlet, redirect, useLoaderData, Link, useLocation, Form, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAppDispatch } from "~/hooks/redux";
import { setCredentials, logout } from "~/store/slices/authSlice";
import { useGetCurrentUserQuery } from "~/store/services/authApi";
import { useAuth } from "~/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
  UsersRound,
  BarChart3,
  Clock,
  Bell,
  Search
} from "lucide-react";
import type { Route } from "./+types/_auth";
import { cn } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const token = getTokenFromCookie(request);

  if (!token) {
    throw redirect("/landingpage");
  }

  return { token };
}

export default function AuthLayout() {
  const { token } = useLoaderData<typeof loader>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const { user: currentUser, isAdmin, isManager } = useAuth();
  const location = useLocation();

  // IMPORTANT: Restore token to Redux store immediately on mount
  // This must happen BEFORE useGetCurrentUserQuery tries to fetch
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ user: null, token }));
    }
  }, [token, dispatch]);


  // Now fetch current user - token will be available in prepareHeaders
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  // Update user in store when fetched
  useEffect(() => {
    if (user && token) {
      dispatch(setCredentials({ user, token }));
    }
  }, [user, token, dispatch]);


  // Handle error - redirect in useEffect instead of during render
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
      dispatch(logout());
      navigate('/landingpage', { replace: true });
    }
  }, [error, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/landingpage');
    // Redirect handled by action or manual navigation
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // if (error) {
  //   dispatch(logout());
  //   throw redirect("/landingpage");
  // }

  // Don't render if no user yet
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Initializing...</div>
      </div>
    );
  }

  // Navigation items with role-based visibility
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["employee", "manager", "company_admin"],
    },
    {
      name: "Clock",
      path: "/clock",
      icon: Clock,
      roles: ["employee", "manager", "company_admin"],
    },
    {
      name: "Rules",
      path: "/rules",
      icon: FileText,
      roles: ["employee", "manager", "company_admin"],
    },
    {
      name: "Create Team",
      path: "/manager/teams/new",
      icon: UsersRound,
      roles: ["manager", "company_admin"],
    },
    {
      name: "Manage My Teams",
      path: "/manager/teams",
      icon: Users,
      roles: ["manager", "company_admin"],
    },

    {
      name: "Manage Users",
      path: "/manager/users",
      icon: Users,
      roles: ["manager", "company_admin"],
    },

    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["employee", "manager", "company_admin"],
    },
  ];

  // Filter navigation based on user role
  const visibleNavigation = navigationItems.filter((item) =>
    item.roles.includes(currentUser?.role || "employee")
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">Time Manager</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex-v-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      active
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex-v-center gap-3 mb-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex-center text-white font-semibold">
              {currentUser?.firstname?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.firstname} {currentUser?.lastname}
              </p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>

          <Form method="post" action="/logout">
            <button
              type="submit"
              onClick={handleLogout}
              className="w-full flex-v-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </Form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
          <div className="flex-between">
            {/* Welcome Message */}
            <div className="flex-v-center gap-4">
              <div className="flex-v-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex-center">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-white font-medium">
                  Welcome back, {currentUser?.firstname} {currentUser?.lastname} !
                </span>
              </div>
            </div>

            {/* Search & Notifications */}
            <div className="flex-v-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper function
function getTokenFromCookie(request: Request): string | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;

  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}