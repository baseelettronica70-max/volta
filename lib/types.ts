export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string | null;
  category_id: number | null;
  status: "draft" | "published";
  pinned: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithCategory extends Article {
  category_name: string | null;
  category_slug: string | null;
}
