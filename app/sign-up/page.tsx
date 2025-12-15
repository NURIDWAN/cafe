"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function SignUpContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push(returnTo);
          },
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error.message || "Failed to create account");
          },
        }
      );
    } catch (error) {
      setLoading(false);
      console.error("Sign up error:", error);
      toast.error("Oops, something went wrong");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-secondary/20">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
          <CardDescription>
            Sign up to access the Cafe Aesthetica admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 max-w-md">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          Sign In
        </Link>
      </p>
      <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 max-w-md">
        By signing up, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg h-96"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
