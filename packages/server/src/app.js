const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ success: true });
});

module.exports = app;
