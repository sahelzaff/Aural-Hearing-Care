import withCache from './lib/withCache';

async function handler(req, res) {
  try {
    // Your API logic here
    const data = {
      // Your data here
    };
    
    return data;
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withCache(handler);
