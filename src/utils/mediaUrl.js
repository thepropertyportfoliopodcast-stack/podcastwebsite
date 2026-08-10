export function encodeMediaUrl(value) {
  if (!value || typeof value !== "string") return value;

  try {
    const url = new URL(value);
    url.pathname = url.pathname
      .split("/")
      .map((segment) => {
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join("/");
    return url.toString();
  } catch {
    return value;
  }
}
