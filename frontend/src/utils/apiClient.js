// Optimized API Client with caching and request deduplication
import axios from 'axios';
import { getCachedData, setCachedData } from './apiCache';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURI,
  timeout: 3000, // 3 second timeout for faster failure detection
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Request deduplication - prevents multiple identical requests
const pendingRequests = new Map();

export const deduplicatedGet = async (url, config = {}) => {
  const requestKey = `${url}-${JSON.stringify(config.params || {})}`;
  const cacheKey = requestKey;
  
  // Check cache first for instant response
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return { data: cachedData, status: 200, fromCache: true };
  }
  
  // If request is already pending, return the same promise
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  
  // Create new request with timeout
  const requestPromise = apiClient.get(url, {
    ...config,
    timeout: config.timeout || 3000, // 3 second timeout
  })
    .then(response => {
      // Cache the response for future use
      setCachedData(cacheKey, response.data);
      return response;
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      // Remove from pending after completion
      pendingRequests.delete(requestKey);
    });
  
  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

// Parallel requests helper
export const parallelRequests = async (requests) => {
  return Promise.all(requests.map(req => 
    typeof req === 'function' ? req() : deduplicatedGet(req.url, req.config)
  ));
};

export default apiClient;

