import { UserPlus } from "lucide-react";

export function AddMembersEmptyState() {
    return (
        <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No members added yet. Search and add employees to your team.</p>
        </div>
    );
}
