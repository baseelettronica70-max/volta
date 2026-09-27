import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Non trovato" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") notFound();

  const text = article.content_format === "html"
    ? article.content.replace(/<[^>]+>/g, " ")
    : article.content.replace(/[#*`>|\-\[\]]/g, "");
  const mins = Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="mb-8 text-sm text-foreground-secondary">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/articoli" className="hover:text-accent transition-colors">
          Articoli
        </Link>
        {article.category_slug && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/categorie/${article.category_slug}`}
              className="hover:text-accent transition-colors"
            >
              {article.category_name}
            </Link>
          </>
        )}
      </nav>

      <header className="mb-10">
        {article.category_name && (
          <Link
            href={`/categorie/${article.category_slug}`}
            className="inline-block text-xs font-medium text-tag-text bg-tag-bg px-2.5 py-1 rounded-full mb-3 hover:opacity-80 transition-opacity"
          >
            {article.category_name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-foreground-secondary text-lg leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mt-5 text-sm text-foreground-secondary">
          {article.published_at && (
            <time>
              {new Date(article.published_at).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          <span className="opacity-40">·</span>
          <span>{mins} min di lettura</span>
        </div>
      </header>

      {article.cover && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-card-border">
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="max-w-none">
        <MarkdownRenderer
          content={article.content}
          format={article.content_format}
        />
      </div>

      <div className="mt-16 pt-8 border-t border-card-border">
        <Link
          href="/articoli"
          className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Torna a tutti gli articoli
        </Link>
      </div>
    </article>
  );
}
