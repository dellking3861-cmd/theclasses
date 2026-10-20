"use client";

import { cn } from "@/utils/cn";
import { useSidebarStore } from "@/store";
import { DashboardSidebar, DashboardHeader, type NavItem } from "@/components/layout/dashboard-sidebar";
import type { User } from "@/types";

interface DashboardShellProps {
  user: User;
  navItems: NavItem[];
  children: React.ReactNode;
  title?: string;
}

export function DashboardShell({ user, navItems, children, title }: DashboardShellProps) {
  const { isCollapsed } = useSidebarStore();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      // Fallback
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={navItems}
        user={user}
        onSignOut={handleSignOut}
      />
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        <DashboardHeader title={title} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
