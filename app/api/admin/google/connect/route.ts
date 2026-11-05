import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { authorizationUrl, getAdminUserId, oauthConfigured, OAUTH_STATE_COOKIE } from "@/lib/google-oauth";
import { popupResponse } from "@/lib/google-popup";

/** Opened in a popup: sends the admin to Google's sign-in and consent screen. */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await getAdminUserId())) {
    return popupResponse(origin, { ok: false, message: "Only admins can connect Google Business Profile. Please log in again." });
  }
  if (!oauthConfigured()) {
    return popupResponse(origin, {
      ok: false,
      message: "Google sign-in is not set up yet: GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are missing in Vercel.",
    });
  }

  const state = randomBytes(24).toString("base64url");
  const res = NextResponse.redirect(authorizationUrl(origin, state));
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: origin.startsWith("https://"),
    sameSite: "lax",
    path: "/api/admin/google",
    maxAge: 600,
  });
  return res;
}
