import { Card } from "~/components/ui/card";
import { Search, Filter } from "lucide-react";

interface TeamFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: "all" | "active" | "inactive";
  setFilterStatus: (status: "all" | "active" | "inactive") => void;
}

export function TeamFilters({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }: TeamFiltersProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search teams by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filter */}
        <div className="flex-v-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
