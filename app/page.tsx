import Link from "next/link";
import { getArticles, getCategories } from "@/lib/db";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getArticles("published");
  const featured = articles.find((a) => a.pinned);
  const latest = articles.filter((a) => a.id !== featured?.id).slice(0, 6);
  const categories = (await getCategories()) as { id: number; name: string; slug: string }[];

  return (
    <>
      {featured && <Hero article={featured} />}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ultimi articoli</h2>
            <p className="text-foreground-secondary mt-1">
              Tutorial e guide per costruire e imparare
            </p>
          </div>
          <Link
            href="/articoli"
            className="text-accent text-sm font-medium hover:underline"
          >
            Vedi tutti
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="bg-background-secondary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Categorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.slug}`}
                className="card-hover bg-card-bg border border-card-border rounded-2xl p-5 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-tag-bg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-tag-text"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="font-medium text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
