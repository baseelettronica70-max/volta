import Link from "next/link";
import { getArticles, getCategories } from "@/lib/db";
import type { ArticleWithCategory } from "@/lib/types";

export default async function AdminDashboard() {
  const articles = (await getArticles()) as ArticleWithCategory[];
  const categories = (await getCategories()) as { id: number; name: string; slug: string }[];

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-foreground-secondary mt-1">
            {articles.length} articolo{articles.length !== 1 ? "i" : ""} totale —{" "}
            {published.length} pubblicato{published.length !== 1 ? "i" : ""},{" "}
            {drafts.length} bozz{drafts.length !== 1 ? "e" : "a"}
          </p>
        </div>
        <Link
          href="/admin/editor/new"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nuovo articolo
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <p className="text-foreground-secondary text-sm mb-1">Pubblicati</p>
          <p className="text-3xl font-bold">{published.length}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <p className="text-foreground-secondary text-sm mb-1">Bozze</p>
          <p className="text-3xl font-bold">{drafts.length}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <p className="text-foreground-secondary text-sm mb-1">Categorie</p>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Categories section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">Categorie</h2>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          {categories.length === 0 ? (
            <p className="text-foreground-secondary p-5 text-sm">Nessuna categoria.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-left">
                  <th className="px-5 py-3 font-medium text-foreground-secondary">Nome</th>
                  <th className="px-5 py-3 font-medium text-foreground-secondary">Slug</th>
                  <th className="px-5 py-3 font-medium text-foreground-secondary text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const catArticles = articles.filter((a) => a.category_slug === cat.slug);
                  return (
                    <tr key={cat.id} className="border-b border-card-border last:border-0">
                      <td className="px-5 py-3 font-medium">{cat.name}</td>
                      <td className="px-5 py-3 text-foreground-secondary font-mono text-xs">{cat.slug}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-foreground-secondary">{catArticles.length} articoli</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Articles list */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Articoli</h2>
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          {articles.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-foreground-secondary mb-4">Nessun articolo ancora. Inizia scrivendone uno!</p>
              <Link
                href="/admin/editor/new"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-full text-sm transition-colors"
              >
                Crea il primo articolo
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-left">
                  <th className="px-5 py-3 font-medium text-foreground-secondary">Titolo</th>
                  <th className="px-5 py-3 font-medium text-foreground-secondary hidden sm:table-cell">Categoria</th>
                  <th className="px-5 py-3 font-medium text-foreground-secondary hidden md:table-cell">Stato</th>
                  <th className="px-5 py-3 font-medium text-foreground-secondary text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-card-border last:border-0 hover:bg-background-secondary/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {article.pinned === 1 && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent shrink-0">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        )}
                        <span className="font-medium truncate">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground-secondary hidden sm:table-cell">
                      {article.category_name ?? "—"}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        article.status === "published"
                          ? "bg-success/10 text-success"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      }`}>
                        {article.status === "published" ? "Pubblicato" : "Bozza"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/editor/${article.id}`} className="text-accent hover:underline font-medium">
                        Modifica
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
