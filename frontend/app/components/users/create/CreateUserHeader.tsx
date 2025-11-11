import { ArrowLeft } from "lucide-react";

interface CreateUserHeaderProps {
  onBack: () => void;
}

export function CreateUserHeader({ onBack }: CreateUserHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-white">Create New User</h1>
        <p className="text-gray-400 mt-1">Add a new user to the system</p>
      </div>
    </div>
  );
}
