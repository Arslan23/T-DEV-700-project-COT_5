import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetTeamByIdQuery, useUpdateTeamMutation } from "~/store/services/teamsApi";
import { useGetUsersQuery } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { AlertCircle, Check } from "lucide-react";
import { EditTeamHeader } from "~/components/teams/EditTeamHeader";
import { TeamInformationForm } from "~/components/teams/TeamInformationForm";
import { TeamMembersEditor } from "~/components/teams/TeamMembersEditor";
import { EditTeamActions } from "~/components/teams/EditTeamActions";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: team, isLoading: isLoadingTeam } = useGetTeamByIdQuery(id!); 
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

  const [formData, setFormData] = useState<{ name: string; description: string; status: string }>({
    name: "",
    description: "",
    status: "active",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
        status: team.status || "active",
      });
      setSelectedMembers(team.members_detail?.map((m: any) => m.id) || []);
    }
  }, [team]);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Team name must be at least 3 characters";
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateTeam({
        id: id!,
        data: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          memberIds: selectedMembers,
        },
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/manager/teams/${id}`);
      }, 2000);
    } catch (error: any) {
      setErrors({ name: error?.data?.message || "Failed to update team" });
    }
  };

  const handleAddMember = (userId: string) => {
    setSelectedMembers([...selectedMembers, userId]);
    setSearchQuery("");
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== userId));
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
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <EditTeamHeader teamName={team.name} onBack={() => navigate(`/manager/teams/${id}`)} />

      {showSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-400" />
          <p className="text-green-400">Team updated successfully! Redirecting...</p>
        </div>
      )}

      {errors.name && !formData.description && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{errors.name}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TeamInformationForm 
          formData={formData} 
          setFormData={setFormData} 
          errors={errors} 
          setErrors={setErrors} 
        />
        <TeamMembersEditor
          allUsers={users}
          isLoadingUsers={isLoadingUsers}
          selectedMembers={selectedMembers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentUser={user}
        />
        <EditTeamActions 
          onCancel={() => navigate(`/manager/teams/${id}`)} 
          isUpdating={isUpdating} 
          showSuccess={showSuccess} 
        />
      </form>
    </div>
  );
}
