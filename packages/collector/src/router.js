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
    minutes: duration.asMinutes(),
  });
});

router.post('/sample', async (req, res) => {
  const { boardId, reading, sensorId } = req.body;
  if (!boardId || !reading) return res.sendStatus(400);
  await writeSample({ boardId, sensorId, reading });
  res.sendStatus(200);
});

router.post('/samples', async (req, res) => {
  /** @typedef {{ id: number; readings: number[] }} Board */
  /** @type {{ boards: Board[] }} */
  const { boards } = req.body;

  const formattedSamples = boards.map(({ id, readings }) => {
    return readings.map((reading, sensorId) => {
      return { boardId: id, sensorId, reading };
    });
  });
  const flattenedSamples = formattedSamples.reduce(
    (acc, group) => [...acc, ...group],
    []
  );
  await writeSamples(flattenedSamples);
  const duration = getDurationUntilNextSample(sampleHours);
  res.status(201);
  return res.json({
    minutes: duration.asMinutes(),
  });
});

module.exports = router;
