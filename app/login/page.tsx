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

function SignInContent() {
  const [formLoading, setFormLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const handleCredentialLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      // Check if identifier is email or username
      const isEmail = identifier.includes("@");

      await authClient.signIn.email(
        {
          email: isEmail ? identifier : `${identifier}@temp.com`, // Workaround
          password,
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed in!");
            router.push(returnTo);
          },
          onError: (ctx) => {
            setFormLoading(false);
            toast.error(ctx.error.message || "Invalid credentials");
          },
        }
      );
    } catch (error) {
      setFormLoading(false);
      console.error("Authentication error:", error);
      toast.error("Invalid username/email or password");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-secondary/20">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access the Cafe Aesthetica admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="admin or admin@example.com"
                required
                disabled={formLoading}
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
                disabled={formLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={formLoading}>
              {formLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 max-w-md">
        By signing in, you agree to our{" "}
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

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <div className="max-w-md w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg h-96"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
