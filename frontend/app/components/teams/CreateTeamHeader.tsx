import { ArrowLeft } from "lucide-react";

interface CreateTeamHeaderProps {
  onBack: () => void;
}

export function CreateTeamHeader({ onBack }: CreateTeamHeaderProps) {
  return (
    <div className="flex-v-center gap-4">
      <button
        onClick={onBack}
        className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Team</h1>
        <p className="text-gray-400 mt-1">Set up a new team and add members</p>
      </div>
    </div>
  );
}
