import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Mail, Briefcase, User as UserIcon } from "lucide-react";
import { getInitials } from "~/lib/utils";
import type { User } from "types/user.types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-purple-400" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(user.firstname, user.lastname)}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <Briefcase className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <Badge
                variant={
                  user.role === "company_admin"
                    ? "default"
                    : user.role === "manager"
                    ? "info"
                    : "default"
                }
              >
                {user.role.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* {user.createdAt && (
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}
