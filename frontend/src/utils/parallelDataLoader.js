import { deduplicatedGet } from './apiClient';
import { getCachedData, setCachedData } from './apiCache';

/**
 * Load multiple API endpoints in parallel for faster page loads
 * @param {Array} endpoints - Array of {key, url, cacheKey} objects
 * @returns {Promise<Object>} Object with data keyed by endpoint keys
 */
export const loadDataInParallel = async (endpoints) => {
  const promises = endpoints.map(async ({ key, url, cacheKey, params }) => {
    try {
      // Check cache first
      const cachedData = cacheKey ? getCachedData(cacheKey) : null;
      
      if (cachedData) {
        return { key, data: cachedData, fromCache: true };
      }

      // Fetch fresh data
      const response = await deduplicatedGet(url, params ? { params } : {});
      const data = response.data;

      // Cache the data
      if (cacheKey) {
        setCachedData(cacheKey, data);
      }

      return { key, data, fromCache: false };
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return { key, data: null, error: error.message, fromCache: false };
    }
  });

  const results = await Promise.all(promises);
  
  // Convert array to object
  const dataMap = {};
  results.forEach(({ key, data, error, fromCache }) => {
    dataMap[key] = { data, error, fromCache };
  });

  return dataMap;
};

/**
 * Load education page data in parallel
 */
export const loadEducationPageData = async () => {
  return loadDataInParallel([
    {
      key: 'categories',
      url: `${import.meta.env.VITE_BASEURI}/user/getallcategories`,
      cacheKey: 'all-categories-education'
    },
    {
      key: 'users',
      url: `${import.meta.env.VITE_BASEURI}/user/getAllUsers`,
      cacheKey: 'all-users-education'
    }
  ]);
};

/**
 * Load healthcare page data in parallel
 */
export const loadHealthcarePageData = async () => {
  return loadDataInParallel([
    {
      key: 'categories',
      url: `${import.meta.env.VITE_BASEURI}/user/getallcategories`,
      cacheKey: 'all-categories-healthcare'
    },
    {
      key: 'users',
      url: `${import.meta.env.VITE_BASEURI}/user/getHealthcareUsers`,
      cacheKey: 'all-users-healthcare'
    }
  ]);
};

