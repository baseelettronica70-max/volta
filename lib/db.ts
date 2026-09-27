import { createClient, type Row } from "@libsql/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { ArticleWithCategory } from "./types";

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), "..");
const LOCAL_DB_PATH = path.join(PROJECT_ROOT, "data", "volta.db");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export function isTursoConfigured(): boolean {
  if (url) return Boolean(url && authToken);
  // Local (file) mode: create dir and allow embedded client
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  return true;
}

let _client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (_client) return _client;
  if (url) {
    _client = createClient({ url, authToken: authToken! });
  } else {
    _client = createClient({ url: `file:${LOCAL_DB_PATH}` });
  }
  return _client;
}

// ─── Row mapping ─────────────────────────────────────────

function str(v: Row[keyof Row]): string {
  return typeof v === "string" || typeof v === "number" || typeof v === "bigint"
    ? String(v)
    : "";
}

function nullableStr(v: Row[keyof Row]): string | null {
  if (v === null || v === undefined) return null;
  return str(v);
}

function toArticle(row: Row): ArticleWithCategory {
  return {
    id: Number(row.id),
    title: str(row.title),
    slug: str(row.slug),
    excerpt: str(row.excerpt),
    content: str(row.content),
    content_format: str(row.content_format) === "html" ? "html" : "markdown",
    cover: nullableStr(row.cover),
    category_id:
      row.category_id !== null && row.category_id !== undefined
        ? Number(row.category_id)
        : null,
    status: str(row.status) === "published" ? "published" : "draft",
    pinned: Number(row.pinned ?? 0),
    published_at: nullableStr(row.published_at),
    created_at: str(row.created_at),
    updated_at: str(row.updated_at),
    category_name: nullableStr(row.category_name),
    category_slug: nullableStr(row.category_slug),
  };
}

function toCategory(row: Row) {
  return {
    id: Number(row.id),
    name: str(row.name),
    slug: str(row.slug),
    created_at: str(row.created_at),
  };
}

// ─── Schema + seed ───────────────────────────────────────

let _initPromise: Promise<void> | null = null;

export function initDb(): Promise<void> {
  if (!isTursoConfigured()) {
    throw new Error(
      "Database non configurato: imposta TURSO_DATABASE_URL e TURSO_AUTH_TOKEN (vedi .env.example)"
    );
  }
  if (!_initPromise) {
    _initPromise = initDbImpl();
  }
  return _initPromise;
}

async function initDbImpl() {
  const client = getDb();

  await client.batch([
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      cover TEXT DEFAULT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      pinned INTEGER DEFAULT 0,
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
  ]);

  await ensureContentFormatColumn(client);

  const res = await client.execute("SELECT count(*) as c FROM categories");
  const count = Number(res.rows[0]?.c ?? 0);
  if (count === 0) await seedData(client);
}

async function ensureContentFormatColumn(client: ReturnType<typeof createClient>) {
  const info = await client.execute("PRAGMA table_info(articles)");
  const exists = info.rows.some((r) => str(r.name) === "content_format");
  if (!exists) {
    await client.execute(
      "ALTER TABLE articles ADD COLUMN content_format TEXT DEFAULT 'markdown'"
    );
  }
}

async function seedData(client: ReturnType<typeof createClient>) {
  const { seedArticles } = await import("./seed");
  await seedArticles(client);
}

// ─── Public queries (also used at build time) ───────────

const ARTICLE_SELECT = `
  SELECT a.*, c.name as category_name, c.slug as category_slug
  FROM articles a
  LEFT JOIN categories c ON a.category_id = c.id
`;

export async function getArticles(status?: "published" | "draft"): Promise<ArticleWithCategory[]> {
  await initDb();
  const client = getDb();
  const where = status ? `WHERE a.status = ?` : "";
  const res = await client.execute({
    sql: `${ARTICLE_SELECT} ${where} ORDER BY a.pinned DESC, a.published_at DESC, a.created_at DESC`,
    args: status ? [status] : [],
  });
  return res.rows.map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
  await initDb();
  const client = getDb();
  const res = await client.execute({
    sql: `${ARTICLE_SELECT} WHERE a.slug = ?`,
    args: [slug],
  });
  const row = res.rows[0];
  return row ? toArticle(row) : undefined;
}

export async function getArticleById(id: number): Promise<ArticleWithCategory | undefined> {
  await initDb();
  const client = getDb();
  const res = await client.execute({
    sql: `${ARTICLE_SELECT} WHERE a.id = ?`,
    args: [id],
  });
  const row = res.rows[0];
  return row ? toArticle(row) : undefined;
}

export async function createArticle(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  content_format?: "html" | "markdown";
  cover?: string | null;
  category_id?: number | null;
  status?: string;
  pinned?: number;
}): Promise<ArticleWithCategory> {
  await initDb();
  const client = getDb();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const res = await client.execute({
    sql: `INSERT INTO articles (title, slug, excerpt, content, content_format, cover, category_id, status, pinned, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.slug,
      data.excerpt ?? "",
      data.content ?? "",
      data.content_format ?? "html",
      data.cover ?? null,
      data.category_id ?? null,
      data.status ?? "draft",
      data.pinned ?? 0,
      data.status === "published" ? now : null,
      now,
      now,
    ],
  });
  const id = Number(res.lastInsertRowid);
  return (await getArticleById(id))!;
}

export async function updateArticle(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    content_format: "html" | "markdown";
    cover: string | null;
    category_id: number | null;
    status: string;
    pinned: number;
  }>
): Promise<ArticleWithCategory | undefined> {
  await initDb();
  const client = getDb();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value as string | number | null);
  }

  if (data.status === "published") {
    const current = await getArticleById(id);
    if (current && current.status !== "published") {
      fields.push("published_at = ?");
      values.push(now);
    }
  }

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  await client.execute({
    sql: `UPDATE articles SET ${fields.join(", ")} WHERE id = ?`,
    args: values,
  });
  return getArticleById(id);
}

export async function deleteArticle(id: number): Promise<boolean> {
  await initDb();
  const client = getDb();
  const res = await client.execute({ sql: "DELETE FROM articles WHERE id = ?", args: [id] });
  return Number(res.rowsAffected) > 0;
}

export async function getCategories() {
  await initDb();
  const client = getDb();
  const res = await client.execute("SELECT * FROM categories ORDER BY name");
  return res.rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string) {
  await initDb();
  const client = getDb();
  const res = await client.execute({ sql: "SELECT * FROM categories WHERE slug = ?", args: [slug] });
  const row = res.rows[0];
  return row ? toCategory(row) : undefined;
}

export async function getCategoryById(id: number) {
  await initDb();
  const client = getDb();
  const res = await client.execute({ sql: "SELECT * FROM categories WHERE id = ?", args: [id] });
  const row = res.rows[0];
  return row ? toCategory(row) : undefined;
}

export async function createCategory(name: string, slug: string) {
  await initDb();
  const client = getDb();
  const res = await client.execute({
    sql: "INSERT INTO categories (name, slug) VALUES (?, ?)",
    args: [name, slug],
  });
  return { id: Number(res.lastInsertRowid), name, slug, created_at: new Date().toISOString() };
}

export async function deleteCategory(id: number): Promise<boolean> {
  await initDb();
  const client = getDb();
  const res = await client.execute({ sql: "DELETE FROM categories WHERE id = ?", args: [id] });
  return Number(res.rowsAffected) > 0;
}