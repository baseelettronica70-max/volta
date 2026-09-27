import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  const { origin } = new URL(request.url);
  return NextResponse.redirect(new URL("/admin/login", origin));
}