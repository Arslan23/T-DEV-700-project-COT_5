import { useAuth } from "~/hooks/useAuth";
import { Card } from "~/components/ui/card";
import { FileText, Clock, AlertCircle } from "lucide-react";

export default function Rules() {
  const { user, isAdmin, isManager } = useAuth();

  // Different rules based on role
  const employeeRules = [
    { title: "Clock In/Out", description: "Record your arrival and departure times daily", icon: Clock },
    { title: "Working Hours", description: "Standard working hours: 8:00 AM - 5:00 PM", icon: Clock },
    { title: "Break Time", description: "1 hour lunch break between 12:00 PM - 2:00 PM", icon: Clock },
    { title: "Overtime", description: "Overtime must be pre-approved by your manager", icon: AlertCircle },
  ];

  const managerRules = [
    ...employeeRules,
    { title: "Team Management", description: "Review and approve team member time-off requests", icon: FileText },
    { title: "Reports", description: "Submit weekly team performance reports", icon: FileText },
    { title: "Approvals", description: "Approve overtime requests within 24 hours", icon: AlertCircle },
  ];

  const adminRules = [
    ...managerRules,
    { title: "User Management", description: "Create and manage user accounts", icon: FileText },
    { title: "System Settings", description: "Configure system-wide policies and settings", icon: FileText },
    { title: "Data Access", description: "Full access to all company data and reports", icon: AlertCircle },
  ];

  const rules = isAdmin() ? adminRules : isManager() ? managerRules : employeeRules;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Company Rules & Policies</h1>
        <p className="text-gray-400 mt-1">
          {isAdmin() && "Administrator guidelines and policies"}
          {isManager() && !isAdmin() && "Manager responsibilities and guidelines"}
          {!isManager() && !isAdmin() && "Employee guidelines and company policies"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <Card 
              key={index}
              className="bg-slate-900/50 backdrop-blur border border-slate-700/50 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{rule.title}</h3>
                  <p className="text-sm text-gray-400">{rule.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Role-specific additional sections */}
      {(isManager() || isAdmin()) && (
        <Card className="bg-slate-900/50 backdrop-blur border border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Management Guidelines</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Review team performance metrics weekly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Conduct monthly one-on-one meetings with team members</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Ensure timely approval of time-off and overtime requests</span>
            </li>
          </ul>
        </Card>
      )}

      {isAdmin() && (
        <Card className="bg-red-900/10 backdrop-blur border border-red-500/20 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Administrator Responsibilities</h3>
              <p className="text-sm text-gray-300">
                As an administrator, you have access to sensitive company data. 
                Please ensure compliance with data protection policies and maintain confidentiality.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}