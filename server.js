const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: [
    'https://demo-dev.holomuatech.com',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/message', (req, res) => {
  try {
    const message = { message: "Welcome User" };
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

    const sanitizedName = name.trim(); // Remove leading and trailing whitespace
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
  console.log('SIGINT signal received: closing HTTP server')
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    console.log('HTTP server closed')
    process.exit(0)
  })
})

module.exports = { app, server }
