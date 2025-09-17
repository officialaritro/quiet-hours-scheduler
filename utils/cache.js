class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = 300000) { // 5 minutes default
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set value
    this.cache.set(key, value);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  clear() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const cache = new MemoryCache();

export function withCache(keyFn, ttl = 300000) {
  return (handler) => {
    return async (req, res) => {
      const cacheKey = keyFn(req);
      
      // Check cache
      if (cache.has(cacheKey)) {
        const cachedResult = cache.get(cacheKey);
        return res.status(200).json(cachedResult);
      }

      // Get original response
      const originalJson = res.json;
      let responseData;

      res.json = function(data) {
        responseData = data;
        return originalJson.call(this, data);
      };

      await handler(req, res);

      // Cache successful responses
      if (res.statusCode === 200 && responseData) {
        cache.set(cacheKey, responseData, ttl);
      }
    };
  };
}
