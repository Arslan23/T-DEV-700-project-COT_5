import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { UserPlus } from "lucide-react";
import type { User } from "types/user.types";
import { UserSearchInput } from "./UserSearchInput";
import { AvailableUsersList } from "./AvailableUsersList";
import { SelectedMembersList } from "./SelectedMembersList";

interface TeamMembersEditorProps {
  allUsers: User[] | undefined;
  isLoadingUsers: boolean;
  selectedMembers: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  currentUser: User | null;
}

export function TeamMembersEditor({
  allUsers,
  isLoadingUsers,
  selectedMembers,
  searchQuery,
  setSearchQuery,
  onAddMember,
  onRemoveMember,
  currentUser,
}: TeamMembersEditorProps) {

  const availableUsers = allUsers?.filter(
    (u) => u.id !== currentUser?.id &&
      !selectedMembers.includes(u.id) &&
      u.role === "employee"
  );

  const filteredUsers = availableUsers?.filter((u) =>
    `${u.firstname} ${u.lastname} ${u.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const selectedUserObjects = allUsers?.filter((u) => selectedMembers.includes(u.id));

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            Team Members
          </span>
          <span className="text-sm font-normal text-gray-400">
            {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {searchQuery && (
          <AvailableUsersList
            isLoading={isLoadingUsers}
            users={filteredUsers}
            onAddMember={onAddMember}
          />
        )}

        {selectedUserObjects && selectedUserObjects.length > 0 && (
          <SelectedMembersList
            users={selectedUserObjects}
            onRemoveMember={onRemoveMember}
          />
        )}

        {selectedMembers.length === 0 && !searchQuery && (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No members in this team yet. Search and add employees.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
