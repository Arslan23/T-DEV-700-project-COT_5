import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Users, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Team } from "types/team.types";

interface TeamCardProps {
  team: Team;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function TeamCard({ team, onView, onEdit, onDelete, isSelected, onSelect }: TeamCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card
      className={cn(
        "bg-slate-900/50 backdrop-blur border hover:border-purple-500/50 transition-all cursor-pointer group relative",
        isSelected ? "border-purple-500/50 ring-2 ring-purple-500/20" : "border-slate-700/50"
      )}
      onClick={onView}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-v-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
              <Badge variant={team.status === "active" ? "success" : "default"} className="mt-1">
                {team.status || "active"}
              </Badge>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-10 z-20 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 flex-v-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 flex-v-center gap-2 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Team
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex-v-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
          {team.description || "No description provided"}
        </p>

        {/* Stats */}
        <div className="flex-between pt-4 border-t border-slate-700">
          <div className="flex-v-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{team.members_detail?.length || 0} members</span>
          </div>
          <div className="text-xs text-gray-500">
            Created {new Date(team.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>

        {/* Manager Info */}
        {team.managerName && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-gray-500">
              Manager: <span className="text-gray-400">{team.managerName}</span>
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:via-purple-600/5 group-hover:to-blue-600/5 rounded-lg transition-all pointer-events-none" />
    </Card>
  );
}