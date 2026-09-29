export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function profileUrl(
  value: string | null | undefined,
  provider: "github" | "linkedin",
): string | null {
  const safeUrl = safeExternalUrl(value);
  if (!safeUrl) return null;

  const url = new URL(safeUrl);
  const host = url.hostname.toLowerCase();
  const isExpectedHost =
    provider === "github"
      ? host === "github.com" || host === "www.github.com"
      : host === "linkedin.com" || host === "www.linkedin.com";

  if (!isExpectedHost || url.pathname.split("/").filter(Boolean).length === 0) {
    return null;
  }

  return safeUrl;
}
