const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.status === false) {
    const error = new Error(payload?.message || payload?.errors || `Request failed with status ${response.status}`);
    error.payload = payload;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function addSubscriber(data) {
  return request("/subscriber/add", { method: "POST", body: JSON.stringify(data) });
}

export function addContact(data) {
  return request("/contact/add", { method: "POST", body: JSON.stringify(data) });
}

export function getEpisodes(search = "", topic = "", page = 1, limit = 10) {
  const query = new URLSearchParams({
    search,
    topic,
    page: String(page),
    limit: String(limit),
  });
  return request(`/file/getAll?${query}`, { cache: "no-store" });
}

export function getPodcast(id) {
  return request(`/podcast/get/${encodeURIComponent(id)}`, { cache: "no-store" });
}

export function publicApiError(error, fallback) {
  return error?.payload?.errors || error?.payload?.message || error?.message || fallback;
}
