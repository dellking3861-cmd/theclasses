"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { ROLE_DASHBOARD_PATHS, APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Login failed");
        return;
      }

      toast.success("Welcome back!");
      const userRole = result.user.role as UserRole;
      const dashboardPath = redirect || ROLE_DASHBOARD_PATHS[userRole] || "/dashboard/student";
      router.push(dashboardPath);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefce8] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt={APP_NAME} className="h-10 w-auto logo-hover" />
            <span className="text-xl font-bold text-slate-900">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
              <Input label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} {...register("password")} />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" isLoading={isLoading}>Sign In</Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-yellow-500 hover:text-yellow-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
