import { redirect } from "react-router";
import type { UserRole } from "types/user.types";

export function requireRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function guardRole(userRole: UserRole | undefined, allowedRoles: UserRole[]) {
  if (!requireRole(userRole, allowedRoles)) {
    throw redirect("/unauthorized");
  }
}