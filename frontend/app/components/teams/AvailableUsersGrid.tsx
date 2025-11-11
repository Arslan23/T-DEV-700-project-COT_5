import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Users, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import type { User } from "types/user.types";

interface AvailableUsersGridProps {
  isLoading: boolean;
  users: User[] | undefined;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  searchQuery: string;
}

export function AvailableUsersGrid({ isLoading, users, selectedUsers, onSelectUser, searchQuery }: AvailableUsersGridProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Available Employees
          </span>
          <span className="text-sm font-normal text-gray-400">
            {users?.length || 0} employee{users?.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all cursor-pointer",
                    isSelected
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1",
                      isSelected ? "border-purple-500 bg-purple-500" : "border-slate-600"
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.firstname[0]}{user.lastname[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No employees available</p>
            <p className="text-sm">
              {searchQuery
                ? "No employees match your search criteria."
                : "All employees have already been added to this team."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
