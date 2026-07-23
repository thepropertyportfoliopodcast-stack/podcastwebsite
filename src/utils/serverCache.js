const cache = globalThis.__podcastServerCache || new Map();

if (process.env.NODE_ENV !== "production") {
  globalThis.__podcastServerCache = cache;
}

export async function getCachedValue(key, loader, ttlMs = 300000) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached?.value !== undefined && cached.expiresAt > now) {
    return cached.value;
  }

  if (cached?.promise) return cached.promise;

  const promise = loader()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });

  cache.set(key, { ...cached, promise });
  return promise;
}
