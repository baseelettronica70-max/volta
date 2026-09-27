import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/types";
import GradientCover from "./GradientCover";

interface ArticleCardProps {
  article: ArticleWithCategory;
}

function readingTime(content: string): number {
  const words = content.replace(/[#*`>|\-\[\]]/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const mins = readingTime(article.content);

  return (
    <Link href={`/articoli/${article.slug}`} className="group block">
      <article className="card-hover bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        {article.cover ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="relative h-48 overflow-hidden">
            <GradientCover slug={article.slug} className="w-full h-full relative rounded-none" />
          </div>
        )}

        <div className="p-5">
          {article.category_name && (
            <span className="inline-block text-xs font-medium text-tag-text bg-tag-bg px-2.5 py-1 rounded-full mb-2">
              {article.category_name}
            </span>
          )}

          <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-foreground-secondary text-sm leading-relaxed line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-foreground-secondary">
            <span>{mins} min di lettura</span>
            {article.published_at && (
              <>
                <span className="opacity-40">·</span>
                <span>{new Date(article.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
