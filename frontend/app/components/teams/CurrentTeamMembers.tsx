import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users } from "lucide-react";
import type { TeamMember } from "types/team.types";

interface CurrentTeamMembersProps {
  members: TeamMember[] | undefined;
}

export function CurrentTeamMembers({ members }: CurrentTeamMembersProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Current Team Members ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {members && members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold">
                  {member.fullname[0]}
                </div>
                <span className="text-sm text-white">
                  {member.fullname}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No members in this team yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
