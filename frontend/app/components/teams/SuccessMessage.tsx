import { Check } from "lucide-react";

interface SuccessMessageProps {
  count: number;
}

export function SuccessMessage({ count }: SuccessMessageProps) {
  return (
    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3">
      <Check className="w-5 h-5 text-green-400" />
      <p className="text-green-400">
        Successfully added {count} member{count !== 1 ? 's' : ''} to the team! Redirecting...
      </p>
    </div>
  );
}
