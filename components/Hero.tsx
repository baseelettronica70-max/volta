import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/types";

interface HeroProps {
  article: ArticleWithCategory;
}

function readingTime(content: string): number {
  const words = content.replace(/[#*`>|\-\[\]]/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Hero({ article }: HeroProps) {
  const mins = readingTime(article.content);

  return (
    <section className="hero-gradient relative min-h-[520px] flex items-center">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="max-w-2xl">
          <span className="inline-block text-accent text-xs font-semibold tracking-wider uppercase mb-4">
            In evidenza
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-lg">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mb-8">
            {article.category_name && (
              <span className="text-xs font-medium text-accent bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {article.category_name}
              </span>
            )}
            <span className="text-white/50 text-sm">{mins} min di lettura</span>
          </div>

          <Link
            href={`/articoli/${article.slug}`}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            Leggi l&apos;articolo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
