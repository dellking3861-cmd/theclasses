import { NextResponse, type NextRequest } from "next/server";
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
  "/api",
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

// Simple JWT decode without external dependencies
function decodeJWT(token: string): { sub?: string; email?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookie
  const sessionCookie = request.cookies.get("sb-bkpemjyzktnmamqertnj-auth-token");
  const sessionValue = sessionCookie?.value;

  let user: { id: string; email: string } | null = null;
  if (sessionValue) {
    try {
      const session = JSON.parse(sessionValue);
      if (session?.access_token) {
        const decoded = decodeJWT(session.access_token);
        if (decoded?.sub) {
          user = { id: decoded.sub, email: decoded.email || "" };
        }
      }
    } catch {
      // Invalid session cookie
    }
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isAuthRoute(pathname) && user) {
    // Redirect logged-in users away from auth pages
    const dashboardPath =
      ROLE_DASHBOARD_PATHS["admin" as UserRole] || "/dashboard/admin";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  if (isDashboardRoute(pathname)) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role via simple fetch (not using Supabase client to avoid DNS issues)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    try {
      const profileResponse = await fetch(
        `${supabaseUrl}/rest/v1/users?select=role,is_active&eq=id,${user.id}`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        }
      );

      if (!profileResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const profiles = await profileResponse.json();
      const profile = profiles[0];

      if (!profile?.is_active) {
        return NextResponse.redirect(
          new URL("/login?error=inactive", request.url)
        );
      }

      const requiredRole = getRequiredRole(pathname);
      if (requiredRole && profile.role !== requiredRole) {
        const correctDashboard =
          ROLE_DASHBOARD_PATHS[profile.role as UserRole] || "/home";
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    } catch {
      // If profile check fails, deny access instead of letting it through
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (
    !isPublicRoute(pathname) &&
    !isDashboardRoute(pathname) &&
    !isAuthRoute(pathname)
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
