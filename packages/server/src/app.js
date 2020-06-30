const express = require('express');
const app = express();
const { getDurationUntilNextSample } = require('./utils');
// for now, sample 6 times a day
// 4am, 8am, 12pm, 4pm, 8pm, 12am
const sampleHours = [0, 4, 8, 12, 16, 20];

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.get('/next-sample', (req, res) => {
  const duration = getDurationUntilNextSample(sampleHours);
  return res.json({
    minutes: Math.floor(duration.asMinutes()),
  });
});

app.post('/sample', (req, res) => {
  res.send('accepted sample');
});

module.exports = app;
