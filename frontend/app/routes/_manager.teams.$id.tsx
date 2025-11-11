import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { 
  useGetTeamByIdQuery, 
  useGetTeamStatsQuery,
  useRemoveTeamMemberMutation,
  useDeleteTeamMutation 
} from "~/store/services/teamsApi";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { ConfirmationModal } from "~/components/ui/confirmation-modal";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Mail,
  UserMinus,
  BarChart3,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { formatHours } from "~/lib/utils";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: team, isLoading, error } = useGetTeamByIdQuery(id!);
  const { data: stats } = useGetTeamStatsQuery(id!);
  const [removeMember, { isLoading: isRemoving }] = useRemoveTeamMemberMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const [removeModal, setRemoveModal] = useState<{ isOpen: boolean; member: any | null }>({
    isOpen: false,
    member: null,
  });
  const [deleteModal, setDeleteModal] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    try {
      console.log("VENDERDR ::: 0000")
      console.log("VENDERDR ::: 1111", id, memberId)
      await removeMember({ teamId: id!, userId: memberId }).unwrap();
      setRemoveModal({ isOpen: false, member: null });
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(id!).unwrap();
      navigate("/teams");
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

  if (error || !team) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Failed to load team details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-v-center gap-4">
          <button
            onClick={() => navigate("/manager/teams")}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex-v-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
              <Badge variant={team.status === "active" ? "success" : "default"}>
                {team.status}
              </Badge>
            </div>
            <p className="text-gray-400">{team.description || "No description"}</p>
          </div>
        </div>

        <div className="flex-v-center gap-3">
          <Link
            to={`/manager/teams/${id}/edit`}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex-v-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex-v-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 backdrop-blur p-6">
            <div className="flex-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Members</p>
            <p className="text-3xl font-bold text-white">{stats.totalMembers}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.activeMembers} active</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20 backdrop-blur p-6">
            <div className="flex-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Avg Working Hours</p>
            <p className="text-3xl font-bold text-white">{formatHours(stats.avgWorkingHours)}</p>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/20 backdrop-blur p-6">
            <div className="flex-between mb-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Late Rate</p>
            <p className="text-3xl font-bold text-white">{stats.lateRate}%</p>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/20 backdrop-blur p-6">
            <div className="flex-between mb-4">
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Absence Rate</p>
            <p className="text-3xl font-bold text-white">{stats.absenceRate}%</p>
          </Card>
        </div>
      )}

      {/* Team Members */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex-between">
            <span className="flex-v-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Team Members ({team.members_detail?.length || 0})
            </span>
            <Link
              to={`/manager/teams/${id}/add-member`}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm flex-v-center gap-2 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Add Member
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.members_detail && team.members_detail.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members_detail.map((member) => (
                <div
                  key={member.id}
                  className="flex-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-all"
                >
                  <div className="flex-v-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-center text-white font-semibold">
                      {member.fullname[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {member.fullname}
                      </p>
                      <p className="text-sm text-gray-400 flex-v-center gap-2">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRemoveModal({ isOpen: true, member })}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove from team"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No members in this team yet.</p>
              <Link
                to={`/manager/teams/${id}/add-member`}
                className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add Members
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Member Modal */}
      <ConfirmationModal
        isOpen={removeModal.isOpen}
        onClose={() => setRemoveModal({ isOpen: false, member: null })}
        onConfirm={() => removeModal.member && handleRemoveMember(removeModal.member.id)}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${removeModal.member?.name} from this team?`}
        confirmLabel="Remove"
        variant="danger"
      />

      {/* Delete Team Modal */}
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteTeam}
        title="Delete Team"
        description={`Are you sure you want to delete "${team.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
