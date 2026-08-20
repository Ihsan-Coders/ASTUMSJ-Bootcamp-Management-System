const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const routes = require('./routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

// Security middleware
app.use(helmet());
app.use(cors());

// Parse JSON and limit request body size
app.use(express.json({ limit: '10kb' }));

// Rate limit API requests
app.use('/api', generalLimiter);

// Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;