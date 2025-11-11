import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "~/components/ui/badge";
import { getInitials } from "~/lib/utils";
import { Mail, Eye, Edit, Trash2 } from "lucide-react";

interface UsersTableProps {
  filteredUsers: any[];
  selectedUsers: any[];
  setSelectedUsers: (users: any[]) => void;
  navigate: (path: string) => void;
  setDeleteModal: (modalInfo: { isOpen: boolean; user: any | null }) => void;
}

export function UsersTable({
  filteredUsers,
  selectedUsers,
  setSelectedUsers,
  navigate,
  setDeleteModal,
}: UsersTableProps) {
  return (
    <DataTable
      value={filteredUsers}
      selection={selectedUsers}
      onSelectionChange={(e) => setSelectedUsers(e.value)}
      dataKey="id"
      paginator
      rows={20}
      rowsPerPageOptions={[10, 20, 50]}
      sortMode="multiple"
      emptyMessage="No users found"
      pt={{
        root: { className: "w-full" },
        header: { className: "bg-slate-800/50 p-4 border-b border-slate-700" },
        thead: { className: "bg-slate-800/30" },
        headerRow: { className: "border-b border-slate-700" },
        tbody: { className: "divide-y divide-slate-700/50" },
        bodyRow: { className: "hover:bg-slate-800/50 transition-colors" },
        paginator: {
          root: {
            className:
              "bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center",
          },
          pageButton: ({ context }: any) => ({
            className: `px-3 py-1 rounded transition-colors ${context.active
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-slate-700"
              }`,
          }),
        },
      }}
    >
      <Column
        selectionMode="multiple"
        headerStyle={{ width: "3rem" }}
        pt={{
          headerCheckbox: { root: { className: "w-4 h-4" } },
          rowCheckbox: { root: { className: "w-4 h-4" } },
        }}
      />

      <Column
        header="User"
        body={(rowData) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
              {getInitials(rowData.firstName, rowData.lastName)}
            </div>
            <div>
              <p className="font-medium text-white">
                {rowData.firstName} {rowData.lastName}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {rowData.email}
              </p>
            </div>
          </div>
        )}
        sortable
        sortField="firstName"
      />

      <Column
        field="role"
        header="Role"
        body={(rowData) => (
          <Badge
            variant={
              rowData.role === "company_admin" ? "success" : rowData.role === "manager"
                  ? "info"
                  : "default"
            }
          >
            {rowData.role === "company_admin" ? "company_admin".toUpperCase() : rowData.role === "manager" ? "manager".toUpperCase() : "employee".toUpperCase()}
          </Badge>
        )}
        sortable
      />

      <Column
        field="status"
        header="Status"
        body={(rowData) => (
          <Badge variant={rowData.status === "active" ? "success" : "default"}>
            {rowData.status || "active"}
          </Badge>
        )}
        sortable
      />

      <Column
        header="Actions"
        body={(rowData) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/manager/users/${rowData.id}`)}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/manager/users/${rowData.id}/edit`)}
              className="p-2 text-gray-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteModal({ isOpen: true, user: rowData })}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </DataTable>
  );
}
