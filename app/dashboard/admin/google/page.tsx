"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader, LoadingSpinner } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/format";
import { AlertTriangle, CheckCircle2, Image as ImageIcon, MapPin, RefreshCw, Star, Unplug } from "lucide-react";

interface Status {
  configured: boolean;
  connected: boolean;
  email: string | null;
  location: { account: string; location: string; title: string } | null;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  reviewCount: number;
  photoCount: number;
  locations: { account: string; location: string; title: string; address: string }[] | null;
  locationsError: string | null;
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function GoogleBusinessPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState<"connect" | "sync" | "disconnect" | "select" | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);

  const load = useCallback(async (withLocations = false) => {
    try {
      const res = await fetch(`/api/admin/google${withLocations ? "?locations=1" : ""}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load status");
      setStatus(json);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load status");
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/google?locations=1", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load status");
        if (active) setStatus(json);
      })
      .catch((err: unknown) => active && setLoadError(err instanceof Error ? err.message : "Could not load status"));
    return () => {
      active = false;
    };
  }, []);

  // The sign-in popup reports back with postMessage when it finishes
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.data?.type !== "gbp-oauth") return;
      setBusy(null);
      if (e.data.ok) toast.success(e.data.message);
      else toast.error(e.data.message);
      void load(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [load]);

  function connect() {
    const w = 520;
    const h = 680;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
    const popup = window.open(
      "/api/admin/google/connect",
      "gbp-oauth",
      `popup=yes,width=${w},height=${h},left=${left},top=${top}`
    );
    if (!popup) {
      toast.error("Your browser blocked the sign-in popup. Allow popups for this site and try again.");
      return;
    }
    popupRef.current = popup;
    setBusy("connect");
    // If the user closes the popup without finishing, stop the spinner
    const timer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(timer);
        setBusy((b) => (b === "connect" ? null : b));
        void load(true);
      }
    }, 800);
  }

  async function post(body: Record<string, string>, kind: "sync" | "select") {
    setBusy(kind);
    try {
      const res = await fetch("/api/admin/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      toast.success(`Synced ${json.reviews} reviews and ${json.photos} photos`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(null);
      void load(true);
    }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect Google Business Profile? Synced reviews and photos will be removed from the website.")) return;
    setBusy("disconnect");
    try {
      await fetch("/api/admin/google", { method: "DELETE" });
      toast.success("Disconnected");
    } finally {
      setBusy(null);
      void load();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Google Business Profile"
        description="Connect your Google listing to show all your reviews and photos on the website. They refresh automatically every day."
      />

      {!status && !loadError && (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      )}
      {loadError && (
        <Card><CardContent className="py-6 text-sm text-red-600">{loadError}</CardContent></Card>
      )}

      {status && (
        <>
          {!status.configured && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex gap-3 py-5 text-sm text-amber-900">
                <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  Google sign-in isn&apos;t set up yet. Add <code>GOOGLE_OAUTH_CLIENT_ID</code> and{" "}
                  <code>GOOGLE_OAUTH_CLIENT_SECRET</code> in Vercel, then redeploy.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="space-y-5 p-5 sm:p-6">
              {status.connected ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-slate-900">Connected{status.email ? ` as ${status.email}` : ""}</p>
                      <p className="text-sm text-slate-500">
                        {status.location ? <>Showing <strong>{status.location.title}</strong></> : "Choose a location below"}
                        {status.lastSyncedAt && <> · last synced {formatDateTime(status.lastSyncedAt)}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={() => post({ action: "sync" }, "sync")} isLoading={busy === "sync"} disabled={!status.location || busy !== null}>
                      <RefreshCw className="h-4 w-4" aria-hidden="true" /> Sync now
                    </Button>
                    <Button variant="outline" onClick={disconnect} isLoading={busy === "disconnect"} disabled={busy !== null}>
                      <Unplug className="h-4 w-4" aria-hidden="true" /> Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-4">
                  <p className="text-sm text-slate-600">
                    Sign in with the Google account that manages <strong>The Classes</strong> on Google Maps. A Google window will
                    open; approve access and it will close by itself.
                  </p>
                  <button
                    type="button"
                    onClick={connect}
                    disabled={!status.configured || busy === "connect"}
                    className="inline-flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <GoogleG className="h-5 w-5" />
                    {busy === "connect" ? "Waiting for Google…" : "Sign in with Google"}
                  </button>
                </div>
              )}

              {status.lastSyncError && (
                <p className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" /> {status.lastSyncError}
                </p>
              )}

              {status.connected && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    <span className="text-sm text-slate-700"><strong className="text-slate-900">{status.reviewCount}</strong> reviews on the website</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <ImageIcon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    <span className="text-sm text-slate-700"><strong className="text-slate-900">{status.photoCount}</strong> photos on the website</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {status.connected && (status.locations?.length ?? 0) > 1 && (
            <Card>
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-3 font-semibold text-slate-900">Choose your location</h2>
                <ul className="space-y-2">
                  {status.locations!.map((l) => {
                    const selected = status.location?.location === l.location;
                    return (
                      <li key={l.location}>
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => post({ action: "select", account: l.account, location: l.location, title: l.title }, "select")}
                          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left ${selected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                          <span>
                            <span className="block font-medium text-slate-900">{l.title}</span>
                            <span className="block text-sm text-slate-500">{l.address}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
          {status.locationsError && status.connected && !status.lastSyncError && (
            <p className="text-sm text-red-700">{status.locationsError}</p>
          )}
        </>
      )}
    </div>
  );
}
