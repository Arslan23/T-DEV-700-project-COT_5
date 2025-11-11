import { ConfirmationModal } from "~/components/ui/confirmation-modal";

interface DeleteModalsProps {
  deleteModal: {
    isOpen: boolean;
    user: any | null;
  };
  setDeleteModal: (modalInfo: { isOpen: boolean; user: any | null }) => void;
  handleDeleteUser: (userId: string) => void;
  bulkDeleteModal: boolean;
  setBulkDeleteModal: (isOpen: boolean) => void;
  handleBulkDelete: () => void;
  selectedUsers: any[];
}

export function DeleteModals({
  deleteModal,
  setDeleteModal,
  handleDeleteUser,
  bulkDeleteModal,
  setBulkDeleteModal,
  handleBulkDelete,
  selectedUsers,
}: DeleteModalsProps) {
  return (
    <>
      {/* Delete Single User Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => deleteModal.user && handleDeleteUser(deleteModal.user.id)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteModal.user?.firstName} ${deleteModal.user?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />

      {/* Bulk Delete Modal */}
      <ConfirmationModal
        isOpen={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Users"
        description={`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`}
        confirmLabel="Delete All"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}
