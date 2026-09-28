export const SERVICE_REDIRECTS: Record<string, string> = {};

export const TEMPORARY_REDIRECTS = [
  {
    source: "/consultation",
    destination: "/book-consultation",
    statusCode: 302,
  },
] as const;

export function getCanonicalServiceSlug(slug: string) {
  return SERVICE_REDIRECTS[slug] ?? slug;
}

export function cleanPathname(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const collapsed = path.replace(/\/{2,}/g, "/");
  if (collapsed === "/") return "/";
  return collapsed.replace(/\/+$/g, "");
}

export function shouldCleanPathname(pathname: string) {
  return pathname !== cleanPathname(pathname) || pathname !== pathname.toLowerCase();
}

export function getCleanPathname(pathname: string) {
  return cleanPathname(pathname).toLowerCase();
}

export function isLegacyEncodedExternalBlogPath(pathname: string) {
  return cleanPathname(pathname).startsWith("/blog/external/external-");
}
