import withCache from '../../lib/withCache';

async function handler(req, res) {
  // Your API logic here
  const data = { /* ... */ };
  return data;
}

export default withCache(handler);
