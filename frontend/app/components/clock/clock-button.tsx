import { useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useClockInOutMutation } from "~/store/services/clocksApi";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";

interface ClockButtonProps {
  currentStatus: 'in' | 'out' | null;
  lastClockTime?: string;
}

export function ClockButton({ currentStatus, lastClockTime }: ClockButtonProps) {
  const [clockInOut, { isLoading }] = useClockInOutMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClock = async () => {
    try {
      await clockInOut().unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Clock in/out failed:', error);
    }
  };

  const isClockIn = currentStatus !== 'in';

  return (
    <div className="text-center">
      <button
        onClick={handleClock}
        disabled={isLoading}
        className={cn(
          "relative w-48 h-48 rounded-full font-bold text-xl transition-all duration-300",
          "shadow-lg hover:shadow-2xl disabled:opacity-50",
          isClockIn
            ? "bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
            : "bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500",
          showSuccess && "scale-110"
        )}
      >
          <div className="flex-col-center gap-3">
            <LoadingSpinner size="lg" className="border-white border-t-transparent" />
            <span className="text-white">Processing...</span>
          </div>
        ) : (
          <div className="flex-col-center gap-3">
            {isClockIn ? (
              <LogIn className="w-12 h-12 text-white" />
            ) : (
              <LogOut className="w-12 h-12 text-white" />
            )}
            <span className="text-white">
              {isClockIn ? 'Clock In' : 'Clock Out'}
            </span>
          </div>
        )
      </button>

      {showSuccess && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-400 text-sm font-medium">
            Successfully {isClockIn ? 'clocked out' : 'clocked in'}!
          </p>
        </div>
      )}

      {lastClockTime && (
        <div className="mt-4">
          <p className="text-gray-400 text-sm">
            Last {currentStatus === 'in' ? 'clock in' : 'clock out'}:
          </p>
          <p className="text-white font-medium">
            {new Date(lastClockTime).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}