import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";
import { createArticle } from "@/lib/db";
import { nanoid } from "nanoid";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session || !validateSessionToken(session.value)) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { getArticles } = await import("@/lib/db");
  return NextResponse.json(await getArticles());
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ error: "Il titolo è obbligatorio" }, { status: 400 });
    }

    const slug = body.slug?.trim() || slugify(title) || nanoid(8);
    const article = await createArticle({
      title,
      slug,
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      cover: body.cover ?? null,
      category_id: body.category_id ?? null,
      status: body.status ?? "draft",
      pinned: body.pinned ?? 0,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore sconosciuto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
