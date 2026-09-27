import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/db";
import { sanitizeArticleHtml } from "@/lib/sanitize";

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

  // Normalizza il formato e sanitizza l'HTML prima di salvare
  if (typeof body.content === "string") {
    const format = body.content_format === "markdown" ? "markdown" : "html";
    body.content_format = format;
    if (format === "html") {
      body.content = sanitizeArticleHtml(body.content);
    }
  } else if (body.content_format !== undefined) {
    body.content_format = body.content_format === "markdown" ? "markdown" : "html";
  }

  // Campi ammessi: evita che il client modifichi id/created_at
  const allowed = [
    "title",
    "slug",
    "excerpt",
    "content",
    "content_format",
    "cover",
    "category_id",
    "status",
    "pinned",
  ] as const;
  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) payload[key] = body[key];
  }

  const updated = await updateArticle(
    Number(id),
    payload as Parameters<typeof updateArticle>[1]
  );

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
