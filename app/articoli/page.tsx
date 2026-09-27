import type { Metadata } from "next";
import { getArticles } from "@/lib/db";
import ArticlesClient from "./ArticlesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articoli",
};

export default async function ArticlesPage() {
  const articles = await getArticles("published");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Articoli</h1>
        <p className="text-foreground-secondary mt-2">
          Tutorial, guide e approfondimenti di elettronica
        </p>
      </div>
      <ArticlesClient articles={articles} />
    </div>
  );
}
