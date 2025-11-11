import { useState } from "react";
import { useNavigate, useActionData, redirect } from "react-router";
import { useCreateTeamMutation } from "~/store/services/teamsApi";
import { useGetUsersQuery } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import { Check, AlertCircle } from "lucide-react";
import { CreateTeamHeader } from "~/components/teams/CreateTeamHeader";
import { TeamInformationForm } from "~/components/teams/TeamInformationForm";
import { CreateTeamActions } from "~/components/teams/CreateTeamActions";
import type { Route } from "./+types/_auth.teams.new";
import { UserSelectionDropdown } from "~/components/teams/UserSelectionDropdown";

export async function action({ request }: Route["ActionArgs"]) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const memberIds = formData.get("memberIds") as string;

  // Validation
  if (!name) {
    return { error: "Team name is required" };
  }

  try {
    // Call your backend API
    const response = await fetch(`${process.env.VITE_API_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        memberIds: memberIds ? JSON.parse(memberIds) : [],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create team");
    }

    return redirect("/manager/teams");
  } catch (error) {
    return { error: "Failed to create team. Please try again." };
  }
}

export default function CreateTeam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const actionData = useActionData<typeof action>();
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const { data: users } = useGetUsersQuery();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | undefined>();
  const [errors, setErrors] = useState<{ name?: string; description?: string; manager?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Selected user objects for members
  const selectedMemberObjects = users?.filter((u) => selectedMembers.includes(u.id));

  const validate = () => {
    const newErrors: { name?: string; description?: string; manager?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Team name must be at least 3 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!selectedManager) {
      newErrors.manager = "A manager must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleSubmit called");

    if (!validate()) {
      console.log("Validation failed. Errors:", errors);
      return;
    }
    if (!selectedManager) {
      console.log("No manager selected.");
      return;
    }

    console.log("Validation passed. Attempting to create team.");

    try {
      await createTeam({
        name: formData.name,
        description: formData.description,
        // status: formData.status as 'active' | 'inactive',
        manager: selectedManager,
        members: selectedMembers,
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/manager/teams");
      }, 2000);
    } catch (error: any) {
      setErrors({ name: error?.data?.message || "Failed to create team" });
    }
  };

  const handleAddMember = (userId: string) => {
    if (userId && !selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== userId));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <CreateTeamHeader onBack={() => navigate("/teams")} />

      {showSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex-v-center gap-3">
          <Check className="w-5 h-5 text-green-400" />
          <p className="text-green-400">Team created successfully! Redirecting...</p>
        </div>
      )}

      {actionData?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex-v-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{actionData.error}</p>
        </div>
      )}
      {errors.manager && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex-v-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{errors.manager}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TeamInformationForm 
          formData={formData} 
          setFormData={setFormData} 
          errors={errors} 
          setErrors={setErrors} 
        />

        {/* Manager Selection */}
        <UserSelectionDropdown
            selectedUsers={selectedManager}
            onUserSelect={setSelectedManager}
            roleFilter="manager"
            selectionType="single"
            title="Select Team Manager"
            placeholder="Select a manager"
        />

        {/* Member Selection */}
        <UserSelectionDropdown 
          selectedUsers={selectedMembers} 
          onUserSelect={handleAddMember} 
          selectedUserObjects={selectedMemberObjects} 
          onRemoveUser={handleRemoveMember} 
          roleFilter="employee"
          selectionType="multiple"
          title="Add Team Members"
          placeholder="Select employees to add..."
        />

        <CreateTeamActions 
          onCancel={() => navigate("/manager/teams")} 
          isCreating={isCreating} 
          showSuccess={showSuccess} 
        />
      </form>
    </div>
  );
}
