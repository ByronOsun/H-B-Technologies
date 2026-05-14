type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

export type BlogPostSummary = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  author?: string;
  created_at?: string | null;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
};

export type ServiceSummary = {
  id?: number;
  slug: string;
  title: string;
  short_description: string;
  created_at?: string | null;
};

export type ServiceDetail = ServiceSummary & {
  full_description?: string;
  technologies?: string[];
  benefits?: string[];
  case_examples?: string[];
  keywords?: string[];
};

function getApiUrlFromEnv() {
  // Server-only env var preferred.
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  }

  // Client cannot read API_URL, only NEXT_PUBLIC_*.
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

async function getJson<T>(
  path: string,
  options?: {
    revalidate?: number;
    cache?: RequestCache;
  }
): Promise<ApiResult<T>> {
  const apiUrl = getApiUrlFromEnv();
  if (!apiUrl) return { ok: false, error: "API_URL is not configured." };

  const url = `${apiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      cache: options?.cache ?? "force-cache",
      next:
        typeof options?.revalidate === "number"
          ? { revalidate: options.revalidate }
          : undefined,
      headers: {
        "Accept": "application/json",
        "User-Agent": "hb-technologies-frontend/1.0",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: text || "Request failed.",
        status: res.status,
      };
    }

    const json = (await res.json()) as { data: T };
    return { ok: true, data: json.data };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function postConsultation(payload: unknown): Promise<ApiResult<void>> {
  // Prefer same-origin proxy route for production-safe operation.
  const url = "/api/consultation";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || "Request failed.", status: res.status };
    }

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function apiHealthCheck(): Promise<ApiResult<{ ok: boolean }>> {
  const apiUrl = getApiUrlFromEnv();
  if (!apiUrl) return { ok: false, error: "API_URL is not configured." };

  try {
    const res = await fetch(`${apiUrl}/health`, { cache: "no-store" });
    if (!res.ok) {
      return { ok: false, error: "Health check failed.", status: res.status };
    }
    const json = (await res.json()) as { ok: boolean };
    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export async function getBlogPosts(options?: {
  revalidate?: number;
}): Promise<ApiResult<BlogPostSummary[]>> {
  return getJson<BlogPostSummary[]>("/blog", {
    revalidate: options?.revalidate ?? 60,
  });
}

export async function getBlogPost(slug: string, options?: {
  revalidate?: number;
}): Promise<ApiResult<BlogPostDetail>> {
  return getJson<BlogPostDetail>(`/blog/${encodeURIComponent(slug)}`, {
    revalidate: options?.revalidate ?? 60,
  });
}

export async function getServices(options?: {
  revalidate?: number;
}): Promise<ApiResult<ServiceSummary[]>> {
  return getJson<ServiceSummary[]>("/services", {
    revalidate: options?.revalidate ?? 60,
  });
}

export async function getService(slug: string, options?: {
  revalidate?: number;
}): Promise<ApiResult<ServiceDetail>> {
  return getJson<ServiceDetail>(`/services/${encodeURIComponent(slug)}`, {
    revalidate: options?.revalidate ?? 60,
  });
}
