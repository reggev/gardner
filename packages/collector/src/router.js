const { Router } = require('express');
const router = Router();

const { getDurationUntilNextSample } = require('./utils');
// for now, sample 6 times a day
// 4am, 8am, 12pm, 4pm, 8pm, 12am
const sampleHours = [0, 4, 8, 12, 16, 20];

router.get('/', (req, res) => {
  res.json({ success: true });
});

router.get('/next-sample', (req, res) => {
  const duration = getDurationUntilNextSample(sampleHours);
  return res.json({
    minutes: Math.floor(duration.asMinutes()),
  });
});

router.post('/sample', (req, res) => {
  res.send('accepted sample');
});

module.exports = router;
