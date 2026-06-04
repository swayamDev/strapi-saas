import React from "react";
import { requireNoAuth } from "@/lib/auth";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireNoAuth();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
