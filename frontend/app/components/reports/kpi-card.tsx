import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  onClick,
}: KPICardProps) {
  const variants = {
    default: 'from-purple-900/30 to-blue-900/30 border-purple-500/20',
    success: 'from-green-900/30 to-emerald-900/30 border-green-500/20',
    warning: 'from-yellow-900/30 to-orange-900/30 border-yellow-500/20',
    danger: 'from-red-900/30 to-orange-900/30 border-red-500/20',
  };

  const iconColors = {
    default: 'bg-purple-500/20 text-purple-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <Card 
      className={cn(
        "bg-gradient-to-br backdrop-blur p-6 transition-all",
        variants[variant],
        onClick && "cursor-pointer hover:scale-105"
      )}
      onClick={onClick}
    >
      <div className="flex-between mb-4">
        <div className={cn("p-3 rounded-lg", iconColors[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && trendValue && (
          <span className={cn("text-xl font-bold", trendColors[trend])}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
      {trendValue && (
        <p className={cn("text-xs mt-2", trendColors[trend || 'neutral'])}>
          {trendValue}
        </p>
      )}
    </Card>
  );
}