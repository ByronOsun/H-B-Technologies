type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

function getApiUrlFromEnv() {
  // Server-only env var preferred.
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  }

  // Client cannot read API_URL, only NEXT_PUBLIC_*.
  return process.env.NEXT_PUBLIC_API_URL ?? "";
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
