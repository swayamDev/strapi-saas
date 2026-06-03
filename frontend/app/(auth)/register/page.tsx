"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconAlertCircle,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;
    const email = data.get("email") as string;
    const pwd = data.get("password") as string;

    const errors: typeof fieldErrors = {};
    if (!username || username.length < 3)
      errors.username = "Username must be at least 3 characters.";
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Enter a valid email address.";
    if (!pwd || pwd.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password: pwd }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Registration failed");

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started for free — no credit card required
        </p>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          <IconBrandGoogle className="size-4" />
          Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          <IconBrandGithub className="size-4" />
          GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">
          or sign up with email
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              autoComplete="username"
              aria-invalid={!!fieldErrors.username}
              disabled={isLoading}
            />
            <FieldError>{fieldErrors.username}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              disabled={isLoading}
            />
            <FieldError>{fieldErrors.email}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.password}
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldError>{fieldErrors.password}</FieldError>

            {/* Password strength hints */}
            {password.length > 0 && (
              <ul className="mt-1 space-y-1">
                {PASSWORD_RULES.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      rule.test(password)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <IconCheck
                      className={`size-3 transition-opacity ${
                        rule.test(password) ? "opacity-100" : "opacity-30"
                      }`}
                    />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </FieldGroup>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
