import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { UserPlus } from "lucide-react";
import type { User } from "types/user.types";
import { useSearchUsersQuery } from "~/store/services/usersApi";
import { UserSearchInput } from "./UserSearchInput";
import { AvailableUsersList } from "./AvailableUsersList";
import { SelectedMembersList } from "./SelectedMembersList";
import { AddMembersEmptyState } from "./AddMembersEmptyState";

interface AddTeamMembersFormProps {
  selectedMembers: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAddMember: (userId: string) => void;
  selectedUserObjects: User[] | undefined;
  handleRemoveMember: (userId: string) => void;
}

export function AddTeamMembersForm({ 
  selectedMembers, 
  searchQuery, 
  setSearchQuery, 
  handleAddMember, 
  selectedUserObjects, 
  handleRemoveMember 
}: AddTeamMembersFormProps) {
  const { data: filteredUsers, isLoading: isLoadingUsers } = useSearchUsersQuery(searchQuery, {
    skip: !searchQuery,
  });

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex-between">
          <span className="flex-v-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            Add Team Members
          </span>
          <Badge variant="info">
            {selectedMembers.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {searchQuery && (
          <AvailableUsersList 
            isLoading={isLoadingUsers}
            users={filteredUsers}
            onAddMember={handleAddMember}
          />
        )}

        {selectedUserObjects && selectedUserObjects.length > 0 && (
          <SelectedMembersList 
            users={selectedUserObjects}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {selectedMembers.length === 0 && !searchQuery && (
          <AddMembersEmptyState />
        )}
      </CardContent>
    </Card>
  );
}
