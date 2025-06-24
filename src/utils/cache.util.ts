// Simple cache utility
const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};