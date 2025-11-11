import { TeamCard } from "./team-card";
import { EmptyState } from "~/components/ui/empty-state";
import { Users } from "lucide-react";
import type { Team } from "types/team.types";

interface TeamsGridProps {
  teams: Team[];
  searchQuery: string;
  filterStatus: string;
  isAdmin: boolean;
  onNavigate: (path: string) => void;
  onDelete: (team: Team) => void;
  selectedTeam: string | null;
  onSelectTeam: (id: string | null) => void;
}

export function TeamsGrid({ teams, searchQuery, filterStatus, isAdmin, onNavigate, onDelete, selectedTeam, onSelectTeam }: TeamsGridProps) {
  return (
    <>{
      teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onView={() => onNavigate(`/manager/teams/${team.id}`)}
              onEdit={() => onNavigate(`/manager/teams/${team.id}/edit`)}
              onDelete={() => onDelete(team)}
              isSelected={selectedTeam === team.id}
              onSelect={() => onSelectTeam(team.id === selectedTeam ? null : team.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No teams found"
          description={
            searchQuery || filterStatus !== "all"
              ? "No teams match your search criteria. Try adjusting your filters."
              : isAdmin
              ? "Create your first team to get started with team management."
              : "You don't have any teams yet. Create one to start managing your team members."
          }
          actionLabel="Create Team"
          onAction={() => onNavigate("/teams/new")}
        />
      )}
    </>
  );
}
