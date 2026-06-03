"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconLoader2,
  IconMailCheck,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailError(undefined);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Strapi v4 forgot-password endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Could not send reset email.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconMailCheck className="size-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your inbox
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>. It
            expires in 1 hour.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Resend email
          </button>
        </p>

        <Button variant="outline" size="lg" className="w-full">
          <Link href="/login">
            <IconArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
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
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!emailError}
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldError>{emailError}</FieldError>
            <FieldDescription>
              We&apos;ll only use this to send you the reset link.
            </FieldDescription>
          </Field>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            Send reset link
          </Button>
        </FieldGroup>
      </form>

      {/* Footer */}
      <Button variant="ghost" size="sm" className="w-full">
        <Link href="/login">
          <IconArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </Button>
    </div>
  );
}
