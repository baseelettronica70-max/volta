"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import RichTextEditor from "@/components/RichTextEditor";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  content_format: "html" | "markdown";
  cover: string | null;
  category_id: number | null;
  status: string;
  pinned: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [articleId, setArticleId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ArticleData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    content_format: "html",
    cover: null,
    category_id: null,
    status: "draft",
    pinned: 0,
  });

  const [titleTouched, setTitleTouched] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      // Fetch categories
      const catRes = await fetch("/api/admin/categories");
      if (catRes.ok) {
        setCategories(await catRes.json());
      }

      if (id && id !== "new") {
        setIsNew(false);
        setArticleId(Number(id));
        const res = await fetch(`/api/admin/articles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title ?? "",
            slug: data.slug ?? "",
            excerpt: data.excerpt ?? "",
            content: data.content ?? "",
            content_format: data.content_format === "markdown" ? "markdown" : "html",
            cover: data.cover ?? null,
            category_id: data.category_id ?? null,
            status: data.status ?? "draft",
            pinned: data.pinned ?? 0,
          });
        }
      }
    })();
  }, [params]);

  const update = <K extends keyof ArticleData>(key: K, val: ArticleData[K]) => {
    setDirty(true);
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleTitleChange = (val: string) => {
    setDirty(true);
    setForm((f) => ({
      ...f,
      title: val,
      slug: titleTouched ? f.slug : slugify(val),
    }));
  };

  const handleSlugBlur = () => setTitleTouched(true);

  const handleSave = async (publish: boolean) => {
    if (!form.title.trim()) {
      setError("Il titolo è obbligatorio");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      status: publish ? "published" : "draft",
    };

    const url = articleId
      ? `/api/admin/articles/${articleId}`
      : "/api/admin/articles";
    const method = articleId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setDirty(false);
        const data = await res.json();
        if (!articleId && data.id) {
          setArticleId(data.id);
          setIsNew(false);
          router.push(`/admin/editor/${data.id}`);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Errore durante il salvataggio");
      }
    } catch {
      setError("Errore di connessione");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;
    if (!confirm("Sei sicuro di voler eliminare questo articolo?")) return;

    const res = await fetch(`/api/admin/articles/${articleId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNew ? "Nuovo articolo" : "Modifica articolo"}
          </h1>
          <p className="text-xs text-foreground-secondary mt-0.5">
            {saving
              ? "Salvataggio in corso…"
              : dirty
                ? "Hai delle modifiche non salvate"
                : "Tutto salvato"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-border bg-card-bg text-sm font-medium hover:bg-background-secondary transition-colors disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva bozza"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            Pubblica
          </button>
          {articleId && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-danger/30 text-danger text-sm font-medium hover:bg-danger/5 transition-colors disabled:opacity-50"
            >
              Elimina
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titolo</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titolo dell'articolo"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card-bg text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              onBlur={handleSlugBlur}
              placeholder="slug-dell-articolo"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card-bg text-sm font-mono focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Estratto</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Breve descrizione dell'articolo"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card-bg text-sm focus:border-accent focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Editor visuale con barra strumenti */}
          <div>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <label className="text-sm font-medium">Contenuto</label>
              <div className="flex items-center gap-3">
                {dirty && (
                  <span className="text-[11px] text-foreground-secondary">
                    ● Modifiche non salvate
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-accent hover:underline"
                >
                  {showPreview ? "Torna a scrivere" : "Anteprima"}
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className="min-h-[400px] border border-border rounded-xl p-5 bg-card-bg overflow-auto">
                {form.content ? (
                  <MarkdownRenderer
                    content={form.content}
                    format={form.content_format}
                  />
                ) : (
                  <p className="text-sm text-foreground-secondary">
                    Nessun contenuto da mostrare.
                  </p>
                )}
              </div>
            ) : form.content_format === "markdown" ? (
              <>
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-accent/30 bg-tag-bg px-3 py-2 text-xs text-foreground-secondary">
                  Questo articolo è in formato Markdown (vecchio formato).
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          "Convertire in formato visuale? Il testo verrà riformattato, l'articolo resterà leggibile."
                        )
                      ) {
                        setForm((f) => ({ ...f, content_format: "html" }));
                        setDirty(true);
                      }
                    }}
                    className="ml-auto font-medium text-accent hover:underline whitespace-nowrap"
                  >
                    Converti in visuale
                  </button>
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  placeholder="# Titolo&#10;&#10;Scrivi il tuo contenuto in Markdown..."
                  rows={20}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card-bg text-sm font-mono leading-relaxed focus:border-accent focus:outline-none transition-colors resize-y min-h-[400px]"
                />
              </>
            ) : (
              <RichTextEditor
                value={form.content}
                onChange={(html) => update("content", html)}
                placeholder="Scrivi il tuo articolo qui… Usa la barra qui sopra per formattare il testo."
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">Impostazioni</h3>

            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-1.5">
                Categoria
              </label>
              <select
                value={form.category_id ?? ""}
                onChange={(e) =>
                  update("category_id", e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-accent focus:outline-none"
              >
                <option value="">Nessuna categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground-secondary">
                In evidenza
              </label>
              <button
                onClick={() => update("pinned", form.pinned ? 0 : 1)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  form.pinned ? "bg-accent" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form.pinned ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">Copertina</h3>

            {form.cover && (
              <div className="relative rounded-xl overflow-hidden border border-card-border">
                <img
                  src={form.cover}
                  alt="Copertina"
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => update("cover", null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-1.5">
                URL immagine
              </label>
              <input
                type="text"
                value={form.cover ?? ""}
                onChange={(e) => update("cover", e.target.value || null)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {!form.cover && (
              <p className="text-xs text-foreground-secondary text-center">
                Se non inserisci un&apos;URL, verrà generato un gradiente automatico
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
