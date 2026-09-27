"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { ArticleWithCategory } from "@/lib/types";

interface Props {
  articles: ArticleWithCategory[];
}

export default function ArticlesClient({ articles }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Map(
      articles
        .filter((a) => a.category_name)
        .map((a) => [a.category_slug!, a.category_name!])
    ).entries()
  );

  const filtered = articles.filter((a) => {
    const matchesQuery =
      query === "" ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === null || a.category_slug === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cerca articoli..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card-bg text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <select
          value={selectedCategory ?? ""}
          onChange={(e) =>
            setSelectedCategory(e.target.value || null)
          }
          className="px-4 py-2.5 rounded-xl border border-border bg-card-bg text-sm focus:border-accent focus:outline-none transition-colors"
        >
          <option value="">Tutte le categorie</option>
          {categories.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-foreground-secondary text-center py-16 text-lg">
          Nessun articolo trovato.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
