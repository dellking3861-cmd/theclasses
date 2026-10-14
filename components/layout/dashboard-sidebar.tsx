"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/lib/constants";
import { useSidebarStore } from "@/store";
import { Avatar } from "@/components/ui/badge";
import type { User } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Bell,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  user: User;
  onSignOut: () => void;
}

export function DashboardSidebar({ navItems, user, onSignOut }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggle, setOpen, toggleCollapse } = useSidebarStore();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white border-r border-amber-200 transition-all duration-300",
          "flex flex-col",
          isCollapsed ? "w-[72px]" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex items-center h-16 px-4 border-b border-amber-100", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link href="/home" className="flex items-center gap-2">
              <img src="/logo.png" alt={APP_NAME} className="h-7 w-auto" />
              <span className="font-bold text-slate-900 text-sm">{APP_NAME}</span>
            </Link>
          )}
          {isCollapsed && (
            <img src="/logo.png" alt={APP_NAME} className="h-7 w-auto" />
          )}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-amber-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-600 hover:bg-amber-50 hover:text-slate-900",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-amber-600")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-amber-100 p-3 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={onSignOut}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium",
              "text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>

        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center h-10 border-t border-amber-100 text-slate-400 hover:text-slate-600 hover:bg-amber-50"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  );
}

interface DashboardHeaderProps {
  title?: string;
  notificationCount?: number;
}

export function DashboardHeader({ title, notificationCount = 0 }: DashboardHeaderProps) {
  const { toggle, isCollapsed } = useSidebarStore();

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-amber-200 bg-[#fffbf0]/80 backdrop-blur-xl px-4 lg:px-6",
      "transition-all duration-300",
      isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
    )}>
      <button
        onClick={toggle}
        className="lg:hidden p-2 rounded-lg hover:bg-amber-100"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-amber-100 text-slate-600">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
