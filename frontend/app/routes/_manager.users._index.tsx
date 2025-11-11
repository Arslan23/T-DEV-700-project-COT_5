import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useGetUsersQuery, useDeleteUserMutation } from "~/store/services/usersApi";
import { useAuth } from "~/hooks/useAuth";
import { EmptyState } from "~/components/ui/empty-state";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Users } from "lucide-react";
import { ManageUsersHeader } from "~/components/users/index/ManageUsersHeader";
import { StatsGrid } from "~/components/users/index/StatsGrid";
import { UserTableFilters } from "~/components/users/index/UserTableFilters";
import { UsersTable } from "~/components/users/index/UsersTable";
import { DeleteModals } from "~/components/users/index/DeleteModals";

export default function ManageUsers() {
  const navigate = useNavigate();
  const { user, isAdmin, isManager } = useAuth();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "employee" | "manager" | "company_admin">("all");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: any | null }>({
    isOpen: false,
    user: null,
  });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  const usersForRole = useMemo(() => {
    if (isManager() && !isAdmin()) {
      return users?.filter(u => u.role === 'employee');
    }
    return users;
  }, [users, isManager, isAdmin]);

  // Filter users based on search and role
  const filteredUsers = usersForRole?.filter((u) => {
    const matchesSearch = 
      u.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: usersForRole?.length || 0,
    active: usersForRole?.filter((u) => u.is_active).length || 0,
    inactive: usersForRole?.filter((u) => !u.is_active).length || 0,
    users: usersForRole?.filter((u) => u.role === "employee").length || 0,
    managers: usersForRole?.filter((u) => u.role === "manager").length || 0,
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const user of selectedUsers) {
        await deleteUser(user.id).unwrap();
      }
      setSelectedUsers([]);
      setBulkDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  };

  const handleExportCSV = () => {
    if (!filteredUsers) return;

    const csv = [
      ["First Name", "Last Name", "Email", "Phone", "Role", "Status"].join(","),
      ...filteredUsers.map((u) => [u.firstname, u.lastname, u.email || "", u.role, u.is_active ? "active" : "inactive"].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Failed to load users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <ManageUsersHeader
        selectedUsersCount={selectedUsers.length}
        onExport={handleExportCSV}
        onBulkDelete={() => setBulkDeleteModal(true)}
        isAdmin={isAdmin() ?? false}
      />

      <StatsGrid stats={stats} isAdmin={isAdmin() ?? false} />

      <UserTableFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        isAdmin={isAdmin() ?? false}
      />

      {filteredUsers && filteredUsers.length > 0 ? (
        <UsersTable
          filteredUsers={filteredUsers}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          navigate={navigate}
          setDeleteModal={setDeleteModal}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No users found"
          description={
            searchQuery || filterRole !== "all"
              ? "No users match your search criteria. Try adjusting your filters."
              : "No users have been created yet. Add your first user to get started."
          }
          actionLabel="Add User"
          onAction={() => navigate("/manager/users/new")}
        />
      )}

      <DeleteModals
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        handleDeleteUser={handleDeleteUser}
        bulkDeleteModal={bulkDeleteModal}
        setBulkDeleteModal={setBulkDeleteModal}
        handleBulkDelete={handleBulkDelete}
        selectedUsers={selectedUsers}
      />
    </div>
  );
}