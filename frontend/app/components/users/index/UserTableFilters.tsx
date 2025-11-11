import { Card } from "~/components/ui/card";
import { Search, Filter } from "lucide-react";

interface UserTableFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRole: "all" | "employee" | "manager" | "company_admin";
  setFilterRole: (role: "all" | "employee" | "manager" | "company_admin") => void;
  isAdmin: boolean;
}

export function UserTableFilters({
  searchQuery,
  setSearchQuery,
  filterRole,
  setFilterRole,
  isAdmin,
}: UserTableFiltersProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filter by Role */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="employee">Employees</option>
            {isAdmin && <option value="manager">Managers</option>}
            {isAdmin && <option value="company_admin">Admins</option>}
          </select>
        </div>
      </div>
    </Card>
  );
}
