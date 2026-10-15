"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("Account created! Please check your email to verify.");
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefce8] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt={APP_NAME} className="h-10 w-auto logo-hover" />
            <span className="text-xl font-bold text-slate-900">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-500 mt-1">Join The Classes today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" error={errors.full_name?.message} {...register("full_name")} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <Input label="Phone" placeholder="+92 3XX XXXXXXX" {...register("phone")} />
              <Select label="I am a" options={roleOptions} error={errors.role?.message} {...register("role")} />
              <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
              <Input label="Confirm Password" type="password" error={errors.confirm_password?.message} {...register("confirm_password")} />
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-500 hover:text-yellow-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
