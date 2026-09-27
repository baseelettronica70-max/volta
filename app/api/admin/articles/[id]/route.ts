import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/db";

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session || !validateSessionToken(session.value)) {
    return false;
  }
  return true;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const updated = await updateArticle(Number(id), body);

  if (!updated) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteArticle(Number(id));
  if (!ok) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
