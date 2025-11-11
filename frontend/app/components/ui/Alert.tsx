import { Check, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface AlertProps {
  variant: "success" | "error";
  message: string;
}

export function Alert({ variant, message }: AlertProps) {
  const isSuccess = variant === "success";
  const Icon = isSuccess ? Check : AlertCircle;
  const colors = isSuccess
    ? "bg-green-500/10 border-green-500/50 text-green-400"
    : "bg-red-500/10 border-red-500/50 text-red-400";

  return (
    <div className={cn("p-4 rounded-lg flex items-center gap-3", colors)}>
      <Icon className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
}
