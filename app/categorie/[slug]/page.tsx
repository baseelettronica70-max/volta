import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, getArticles } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug) as Promise<{ name: string } | undefined>;
  const category = await cat;
  if (!category) return { title: "Non trovato" };
  return { title: category.name };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = (await getCategoryBySlug(slug)) as
    | { id: number; name: string; slug: string }
    | undefined;

  if (!cat) notFound();

  const articles = (await getArticles("published")).filter(
    (a) => a.category_slug === slug
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <nav className="mb-8 text-sm text-foreground-secondary">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{cat.name}</h1>
        <p className="text-foreground-secondary mt-2">
          {articles.length} articolo{articles.length !== 1 ? "i" : ""}
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-foreground-secondary text-center py-16 text-lg">
          Nessun articolo in questa categoria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
