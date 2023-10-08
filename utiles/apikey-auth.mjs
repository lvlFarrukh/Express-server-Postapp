// apikey-auth.js
// Middleware function to authenticate API key
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key']; // Read the API key from request headers

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next(); // Proceed to the next middleware or route handler
}

