// Simple in-memory cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const withCache = (handler) => async (req, res) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return handler(req, res);
  }

  const key = req.url;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  try {
    const data = await handler(req, res);
    
    // Store in cache
    cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Cache handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default withCache;
