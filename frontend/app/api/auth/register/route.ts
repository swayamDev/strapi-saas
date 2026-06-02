import { setAuthCookie } from "@/lib/auth";
import { registerUser } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const auth = await registerUser(
      String(body.username ?? ""),
      String(body.email ?? ""),
      String(body.password ?? ""),
    );
    await setAuthCookie(auth.jwt);

    return NextResponse.json({ user: auth.user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
