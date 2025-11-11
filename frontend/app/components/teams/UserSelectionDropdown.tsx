import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { UserPlus, X, UserSquare } from "lucide-react";
import type { User } from "types/user.types";
import { useGetUsersQuery } from "~/store/services/usersApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";

interface UserSelectionDropdownProps {
  selectedUsers: string[] | string | undefined; // Array for multiple, string for single, undefined for none
  onUserSelect: (userId: string) => void;
  selectedUserObjects?: User[] | User | undefined; // Array for multiple, User for single, undefined for none
  onRemoveUser?: (userId: string) => void; // Optional for single selection
  roleFilter: 'employee' | 'manager';
  selectionType: 'single' | 'multiple';
  title: string;
  placeholder: string;
}

export function UserSelectionDropdown({
  selectedUsers,
  onUserSelect,
  selectedUserObjects,
  onRemoveUser,
  roleFilter,
  selectionType,
  title,
  placeholder,
}: UserSelectionDropdownProps) {
  const { data: allUsers, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [selectKey, setSelectKey] = useState(Date.now()); // Only used for multiple selection

  const filteredUsersByRole = allUsers?.filter(user => user.role === roleFilter);

  // For multiple selection, filter out already selected users
  const availableUsers = selectionType === 'multiple' && Array.isArray(selectedUsers)
    ? filteredUsersByRole?.filter(user => !selectedUsers.includes(user.id))
    : filteredUsersByRole;

  const handleSelect = (userId: string) => {
    if (userId) {
      onUserSelect(userId);
      if (selectionType === 'multiple') {
        setSelectKey(Date.now()); // Reset for multiple selection
      }
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-between">
          <span className="flex-v-center gap-2 text-white">
            {roleFilter === 'employee' ? <UserPlus className="w-5 h-5 text-purple-400" /> : <UserSquare className="w-5 h-5 text-purple-400" />}
            {title}
          </span>
          {selectionType === 'multiple' && Array.isArray(selectedUsers) && (
            <Badge variant="info">
              {selectedUsers.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Selection Dropdown */}
        <div className="relative">
            {isLoadingUsers ? (
                <div className="flex-center py-8">
                    <LoadingSpinner />
                </div>
            ) : (
                <Select
                  key={selectionType === 'multiple' ? selectKey : undefined}
                  value={selectionType === 'single' && typeof selectedUsers === 'string' ? selectedUsers : undefined}
                  onValueChange={handleSelect}
                >
                    <SelectTrigger className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {availableUsers && availableUsers.length > 0 ? (
                            availableUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id} className="focus:bg-slate-700">
                                    <div className="flex-v-center gap-3 p-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white font-semibold">
                                            {user.firstname[0]}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.firstname}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No available users to add</div>
                        )}
                    </SelectContent>
                </Select>
            )}
        </div>


        {/* Selected Users (only for multiple selection) */}
        {selectionType === 'multiple' && Array.isArray(selectedUsers) && selectedUserObjects && Array.isArray(selectedUserObjects) && selectedUserObjects.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-300 mb-3">Selected Members:</p>
            <div className="space-y-2">
              {selectedUserObjects.map((user) => (
                <div
                  key={user.id}
                  className="flex-between p-3 bg-slate-800 border border-slate-700 rounded-lg"
                >
                  <div className="flex-v-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white font-semibold">
                      {user.firstname[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user.firstname}
                      </p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveUser && onRemoveUser(user.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No users selected message */}
        {((selectionType === 'multiple' && Array.isArray(selectedUsers) && selectedUsers.length === 0) || (selectionType === 'single' && !selectedUsers)) && (
          <div className="text-center py-8 text-gray-500">
            {roleFilter === 'employee' ? <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" /> : <UserSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />}
            <p>{selectionType === 'multiple' ? "No members added yet. Select users from the dropdown to add them to your team." : "No manager selected yet. Select a manager from the dropdown."}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}