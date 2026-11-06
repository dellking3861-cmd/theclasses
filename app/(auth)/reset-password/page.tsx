"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/** Landing page for the reset email: the link signs the user in, then they choose a new password. */
export default function ResetPasswordPage() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // The browser client reads the code in the link and signs in; wait for that session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => session && setReady(true));
    supabase.auth.getSession().then(({ data }) => setReady((r) => r || Boolean(data.session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords don't match");
    setError(null);
    setSaving(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSaving(false);
    if (error) return setError(error.message);
    toast.success("Password changed. You're signed in.");
    window.location.assign("/login"); // signed-in users are sent on to their dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>
            {ready === false
              ? "This reset link has expired or was already used."
              : "Enter a new password for your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ready === false ? (
            <Link href="/forgot-password" className="text-sm font-medium text-brand-800 hover:underline">
              Send a new reset link
            </Link>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Input label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input label="Confirm new password" id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error ?? undefined} />
              <Button type="submit" className="w-full" isLoading={saving} disabled={!ready}>
                {ready ? "Save new password" : "Checking your link…"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
