import { Outlet, redirect, useLoaderData } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { Route } from "./+types/_manager";

export async function loader({ request }: Route["LoaderArgs"]) {
  const token = getTokenFromCookie(request);
  
  if (!token) {
    throw redirect("/landingpage");
  }
  
  // Optional: Verify manager role on server-side
  // const user = await getUserFromRequest(request);
  // if (user.role !== 'manager' && user.role !== 'admin') {
  //   throw redirect("/unauthorized");
  // }
  
  return {};
}

export default function ManagerLayout() {
  const { isManager, isAdmin } = useAuth();
  
  // Client-side role guard
  if (!isManager() && !isAdmin()) {
    throw redirect("/unauthorized");
  }
  
  return <Outlet />;
}

function getTokenFromCookie(request: Request): string | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}