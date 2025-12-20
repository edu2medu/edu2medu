// API Response Cache Utility
// This provides simple caching for API responses to reduce redundant requests

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Create a cached axios wrapper (deprecated - use apiClient instead)
export const cachedAxiosGet = async (url, axiosInstance, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options.params || {})}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return Promise.resolve({ data: cached, fromCache: true });
  }
  
  // Fetch fresh data
  try {
    const response = await axiosInstance.get(url, options);
    setCachedData(cacheKey, response.data);
    return { ...response, fromCache: false };
  } catch (error) {
    throw error;
  }
};

