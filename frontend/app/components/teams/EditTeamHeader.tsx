import { ArrowLeft } from "lucide-react";

interface EditTeamHeaderProps {
  teamName: string;
  onBack: () => void;
}

export function EditTeamHeader({ teamName, onBack }: EditTeamHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Team</h1>
        <p className="text-gray-400 mt-1">Update {teamName}'s information</p>
      </div>
    </div>
  );
}
