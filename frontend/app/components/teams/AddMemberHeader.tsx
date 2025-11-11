import { ArrowLeft } from "lucide-react";
import { Badge } from "~/components/ui/badge";

interface AddMemberHeaderProps {
  teamName: string;
  selectedCount: number;
  onBack: () => void;
}

export function AddMemberHeader({ teamName, selectedCount, onBack }: AddMemberHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white">Add Members</h1>
        <p className="text-gray-400 mt-1">Add employees to {teamName}</p>
      </div>
      <Badge variant="info" className="text-base px-4 py-2">
        {selectedCount} selected
      </Badge>
    </div>
  );
}
