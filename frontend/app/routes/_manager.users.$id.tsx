import { useParams, useNavigate } from "react-router";
import { useGetUserByIdQuery, useDeleteUserMutation } from "~/store/services/usersApi";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { ConfirmationModal } from "~/components/ui/confirmation-modal";
import { useState } from "react";
import { UserDetailHeader } from "~/components/users/detail/UserDetailHeader";
import { ProfileCard } from "~/components/users/detail/ProfileCard";
import { StatsCards } from "~/components/users/detail/StatsCards";
import { RecentActivity } from "~/components/users/detail/RecentActivity";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(id!);
  const [deleteUser] = useDeleteUserMutation();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDeleteUser = async () => {
    try {
      await deleteUser(id!).unwrap();
      navigate("/manager/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Failed to load user details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <UserDetailHeader
        user={user}
        id={id ?? ""}
        onBack={() => navigate("/manager/users")}
        onDelete={() => setDeleteModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard user={user} />

        <div className="lg:col-span-2 space-y-6">
          <StatsCards />
          <RecentActivity />
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${user.firstname} ${user.lastname}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}