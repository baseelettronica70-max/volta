import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, validateSessionToken } from "@/lib/auth";
import { getCategories, createCategory } from "@/lib/db";

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
  return NextResponse.json(await getCategories());
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Il nome è obbligatorio" }, { status: 400 });
    }

    const slug = slugify(name.trim());
    const cat = await createCategory(name.trim(), slug);
    return NextResponse.json(cat, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore sconosciuto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
