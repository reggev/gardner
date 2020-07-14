const { Router } = require('express');
const router = Router();

const { getDurationUntilNextSample } = require('./utils');
const { writeSample, writeSamples } = require('./sampleDatasource');

// sample 6 times a day
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

router.post('/sample', async (req, res) => {
  const { id, reading } = req.body;
  const [boardId, sensorId] = id.split('::');
  if (!boardId || !sensorId) return res.sendStatus(400);
  await writeSample({ signature: id, boardId, sensorId, reading });
  res.sendStatus(200);
});

router.post('/samples', async (req, res) => {
  const { samples } = req.body;
  const formattedSamples = samples.map(({ id, reading }) => {
    const [boardId, sensorId] = id.split('::');
    if (!boardId || !sensorId) return res.sendStatus(400);
    return { signature: id, boardId, sensorId, reading };
  });
  await writeSamples(formattedSamples);
  res.sendStatus(200);
});

module.exports = router;
