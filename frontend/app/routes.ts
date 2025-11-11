import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/_index.tsx"),
  route("unauthorized", "routes/unauthorized.tsx"),
  route("landingpage", "routes/landingpage.tsx"),

  // Protected routes - All authenticated users
  layout("routes/_auth.tsx", [
    route("dashboard", "routes/_auth.dashboard.tsx"),
    route("profile", "routes/_auth.profile.tsx"),
    route("clock", "routes/_auth.clock.tsx"),
    route("rules", "routes/_auth.rules.tsx"),
    route("settings", "routes/_auth.settings.tsx"),

    layout("routes/_manager.tsx", [
      ...prefix("manager/teams", [
        // Teams management
        index("routes/_manager.teams._index.tsx"),
        route("new", "routes/_manager.teams.new.tsx"),
        route(":id", "routes/_manager.teams.$id.tsx"),
        route(":id/add-member", "routes/_manager.teams.$id.add-member.tsx"),
        route(":id/edit", "routes/_manager.teams.$id.edit.tsx"),

        // Employee management (manager's team only)
        route("employees", "routes/_manager.employees.tsx"),

        // Reports and KPIs for manager's teams
        route("reports", "routes/_manager.reports.tsx"),
      ]),

      ...prefix("manager/users", [
        index("routes/_manager.users._index.tsx"),
        route("new", "routes/_manager.users.new.tsx"),
        route(":id", "routes/_manager.users.$id.tsx"),
        route(":id/edit", "routes/_manager.users.$id.edit.tsx"),
      ]),
    ]),
  ]),


  // Admin-only routes
  // layout("routes/_admin.tsx", [
  //   ...prefix("admin", [
  //     // User management
  //     layout("users", "routes/_admin.users.tsx", [
  //       index("routes/_admin.users._index.tsx"),
  //       route("new", "routes/_admin.users.new.tsx"),
  //       route(":id", "routes/_admin.users.$id.tsx"),
  //       route(":id/edit", "routes/_admin.users.$id.edit.tsx"),
  //     ]),

  //     // All teams management
  //     layout("teams", "routes/_admin.teams.tsx", [
  //       index("routes/_admin.teams._index.tsx"),
  //       route("new", "routes/_admin.teams.new.tsx"),
  //       route(":id", "routes/_admin.teams.$id.tsx"),
  //     ]),

  //     // Global reports and KPIs
  //     route("reports", "routes/_admin.reports.tsx"),

  //     // System settings
  //     route("settings", "routes/_admin.settings.tsx"),
  //   ]),
  // ]),

  // 404 catch-all
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;