import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";
import { deleteCategory } from "@/lib/db";

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session || !validateSessionToken(session.value)) {
    return false;
  }
  return true;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteCategory(Number(id));
  if (!ok) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
