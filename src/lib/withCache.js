import client from './redis';

export default function withCache(handler) {
  return async (req, res) => {
    const key = req.url;
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      const result = await handler(req, res);
      
      await client.set(key, JSON.stringify(result), {
        EX: 60 * 5 // 5 minutes
      });
      
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
