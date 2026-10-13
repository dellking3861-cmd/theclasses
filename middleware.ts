import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROLE_DASHBOARD_PATHS, type UserRole } from "@/lib/constants";

const PUBLIC_ROUTES = [
  "/home",
  "/about",
  "/courses",
  "/admissions",
  "/contact",
  "/blog",
  "/ai-learning-programs",
  "/login",
  "/register",
  "/forgot-password",
];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const DASHBOARD_PREFIX = "/dashboard";

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith(DASHBOARD_PREFIX);
}

function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/teacher")) return "teacher";
  if (pathname.startsWith("/dashboard/student")) return "student";
  if (pathname.startsWith("/dashboard/parent")) return "parent";
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabase, user, supabaseResponse } = await updateSession(request);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isAuthRoute(pathname) && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[profile.role as UserRole] || "/dashboard/student";
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  if (isDashboardRoute(pathname)) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const requiredRole = getRequiredRole(pathname);
    if (requiredRole) {
      const { data: profile } = await supabase
        .from("users")
        .select("role, is_active")
        .eq("id", user.id)
        .single();

      if (!profile?.is_active) {
        return NextResponse.redirect(new URL("/login?error=inactive", request.url));
      }

      if (profile.role !== requiredRole) {
        const correctDashboard =
          ROLE_DASHBOARD_PATHS[profile.role as UserRole] || "/home";
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }
  }

  if (!isPublicRoute(pathname) && !isDashboardRoute(pathname) && !isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
