import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Password non valida" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    );
  }
}
