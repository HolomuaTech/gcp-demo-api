const express = require('express');
const cors = require('cors');

const app = express();

/**
 * --------------------------------------------------------------------
 *  CORS configuration
 *  • Set ALLOWED_ORIGINS in Cloud Run / Terraform, e.g.
 *      ALLOWED_ORIGINS=https://demo-dev.holomuatech.com
 *  • Multiple origins? Separate with commas.
 *  • If ALLOWED_ORIGINS is empty, default to "*" for dev convenience.
 * --------------------------------------------------------------------
 */
const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);              // remove empty strings

app.use(
  cors({
    origin: (origin, cb) => {
      // No Origin header (curl, health-check, etc.) → allow
      if (!origin) return cb(null, true);

      // Allow if list empty ("*") or in whitelist
      if (allowed.length === 0 || allowed.includes(origin)) {
        return cb(null, true);
      }

      // Otherwise block
      return cb(new Error(`CORS: ${origin} not allowed`), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.use(express.json());

app.get('/message', (req, res) => {
  try {
    const message = { message: 'Welcome User' };
    res.status(200).json(message);
    console.log(`API message sent: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error('Error in /message endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to handle POST request
app.post('/submit', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing name' });
    }

    const sanitizedName = name.trim(); // Remove leading/trailing whitespace
    const message = `Hello, ${sanitizedName}! Nice to meet you!`;

    res.status(201).json({ message });
    console.log(`Submit API: Message sent for ${sanitizedName}`);
  } catch (error) {
    console.error('Error in /submit endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press CTRL-C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
