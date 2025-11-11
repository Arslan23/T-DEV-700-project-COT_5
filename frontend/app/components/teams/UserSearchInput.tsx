import { Search } from "lucide-react";

interface UserSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function UserSearchInput({ searchQuery, setSearchQuery }: UserSearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search employees to add..."
        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
