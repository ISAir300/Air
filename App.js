const express = require('express');
const app = express();
const babyRouter = require('./api/upload/baby');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add any additional middleware or configurations here

// Routes
app.use('/api/upload', babyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
