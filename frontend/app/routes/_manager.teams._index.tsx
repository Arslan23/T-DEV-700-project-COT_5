import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useGetTeamsQuery, useDeleteTeamMutation } from "~/store/services/teamsApi";
import { useAuth } from "~/hooks/useAuth";
import { ConfirmationModal } from "~/components/ui/confirmation-modal";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Plus, Users } from "lucide-react";
import { TeamStats } from "~/components/teams/TeamStats";
import { TeamFilters } from "~/components/teams/TeamFilters";
import { TeamsGrid } from "~/components/teams/TeamsGrid";
import type { Route } from "./+types/_auth.teams._index";

export async function loader({ request }: Route["LoaderArgs"]) {
  // Optional: Pre-fetch teams data on server
  return {};
}

export default function ManageTeams() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { data: teams, isLoading, error } = useGetTeamsQuery();
  const [deleteTeam] = useDeleteTeamMutation();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; team: any | null }>({
    isOpen: false,
    team: null,
  });
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Filter teams based on role
  const myTeams = teams?.filter((team) => {
    if (isAdmin()) return true;
    return team.managerId === user?.id;
  });

  // Apply search and filters
  const filteredTeams = myTeams?.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || team.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId).unwrap();
      setDeleteModal({ isOpen: false, team: null });
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Failed to load teams. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage My Teams</h1>
          <p className="text-gray-400 mt-1">
            {isAdmin() ? "Manage all teams in the organization" : "Manage your teams and members"}
          </p>
        </div>
        <Link
          to="/manager/teams/new"
          className="flex-v-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create Team
        </Link>
      </div>

      {myTeams && <TeamStats teams={myTeams} />}

      <TeamFilters 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus} 
      />

      {filteredTeams && <TeamsGrid 
        teams={filteredTeams} 
        searchQuery={searchQuery} 
        filterStatus={filterStatus} 
        isAdmin={isAdmin()} 
        onNavigate={navigate} 
        onDelete={(team) => setDeleteModal({ isOpen: true, team })} 
        selectedTeam={selectedTeam} 
        onSelectTeam={setSelectedTeam} 
      />}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, team: null })}
        onConfirm={() => deleteModal.team && handleDeleteTeam(deleteModal.team.id)}
        title="Delete Team"
        description={`Are you sure you want to delete "${deleteModal.team?.name}"? This action cannot be undone and will remove all team members.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
