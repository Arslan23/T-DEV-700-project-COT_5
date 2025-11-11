import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetTeamByIdQuery, useAddTeamMemberMutation } from "~/store/services/teamsApi";
import { useGetUsersQuery } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { AddMemberHeader } from "~/components/teams/AddMemberHeader";
import { AddMemberActions } from "~/components/teams/AddMemberActions";
import { AvailableUsersGrid } from "~/components/teams/AvailableUsersGrid";
import { CurrentTeamMembers } from "~/components/teams/CurrentTeamMembers";
import { SuccessMessage } from "~/components/teams/SuccessMessage";

export default function AddTeamMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: team, isLoading: isLoadingTeam } = useGetTeamByIdQuery(id!); 
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [addMember, { isLoading: isAdding }] = useAddTeamMemberMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const currentMemberIds = team?.members_detail?.map((m: any) => m.id) || [];

  const availableUsers = users?.filter(
    (u) =>
      u.id !== user?.id &&
      !currentMemberIds.includes(u.id) &&
      u.role === "employee"
  );

  const filteredUsers = availableUsers?.filter((u) =>
    `${u.firstname} ${u.lastname} ${u.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map((u) => u.id) || []);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      let successCount = 0;
      for (const userId of selectedUsers) {
        await addMember({ teamId: id!, userId }).unwrap();
        successCount++;
      }
      
      setAddedCount(successCount);
      setSelectedUsers([]);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(`/manager/teams/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Team not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <AddMemberHeader 
        teamName={team.name} 
        selectedCount={selectedUsers.length} 
        onBack={() => navigate(`/manager/teams/${id}`)} 
      />

      {showSuccess && <SuccessMessage count={addedCount} />}

      <AddMemberActions 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectAll={handleSelectAll}
        onAddMembers={handleAddMembers}
        selectedCount={selectedUsers.length}
        isAdding={isAdding}
        isAllSelected={selectedUsers.length === filteredUsers?.length}
      />

      <AvailableUsersGrid 
        isLoading={isLoadingUsers}
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
      />

      <CurrentTeamMembers members={team.members_detail} />
    </div>
  );
}
