// Optimized API Client with caching and request deduplication
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURI,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
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
  
  // If request is already pending, return the same promise
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  
  // Create new request
  const requestPromise = apiClient.get(url, config)
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

