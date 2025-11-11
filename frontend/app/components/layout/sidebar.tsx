import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
}

function SidebarItem({ icon: Icon, label, path, isActive }: SidebarItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex-v-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-purple-600 text-white"
          : "text-gray-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  items: Array<{
    icon: LucideIcon;
    label: string;
    path: string;
  }>;
}

export function Sidebar({ items }: SidebarProps) {
  const location = useLocation();

  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.path}>
            <SidebarItem
              {...item}
              isActive={location.pathname === item.path}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}