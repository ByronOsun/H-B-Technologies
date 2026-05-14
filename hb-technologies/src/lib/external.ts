export type ExternalArticle = {
  id: number | string;
  title: string;
  description?: string;
  url: string;
  published_at?: string;
  cover_image?: string | null;
  readable_publish_date?: string;
  tag_list?: string[];
  user?: { name?: string };
};

type DevToApiArticle = {
  id?: number;
  title?: string;
  description?: string;
  excerpt?: string;
  social_image_caption?: string;
  url?: string;
  published_at?: string;
  created_at?: string;
  cover_image?: string | null;
  social_image?: string | null;
  readable_publish_date?: string;
  tag_list?: string[];
  user?: { name?: string };
};

export async function fetchDevToByTag(tag: string, per_page = 6): Promise<ExternalArticle[]> {
  if (!tag) return [];
  const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=${per_page}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    if (!Array.isArray(json)) return [];
    return json.map((item): ExternalArticle => {
      const article = item as DevToApiArticle;
      return {
        id: article.id || article.url || article.title || crypto.randomUUID(),
        title: article.title || "Untitled article",
        description:
          article.description || article.excerpt || article.social_image_caption || "",
        url: article.url || "",
        published_at: article.published_at || article.created_at || undefined,
        cover_image: article.cover_image || article.social_image || null,
        readable_publish_date: article.readable_publish_date,
        tag_list: article.tag_list || [],
        user: article.user || {},
      };
    });
  } catch {
    return [];
  }
}

export async function fetchDevToArticleById(id: string | number): Promise<ExternalArticle | null> {
  if (!id) return null;

  try {
    const res = await fetch(`https://dev.to/api/articles/${encodeURIComponent(String(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json: unknown = await res.json();
    if (!json || typeof json !== "object") return null;

    const article = json as DevToApiArticle;
    return {
      id: article.id || article.url || article.title || String(id),
      title: article.title || "Untitled article",
      description:
        article.description || article.excerpt || article.social_image_caption || "",
      url: article.url || "",
      published_at: article.published_at || article.created_at || undefined,
      cover_image: article.cover_image || article.social_image || null,
      readable_publish_date: article.readable_publish_date,
      tag_list: article.tag_list || [],
      user: article.user || {},
    };
  } catch {
    return null;
  }
}
