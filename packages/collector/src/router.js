const { Router } = require('express');

const router = Router();

const { getDurationUntilNextSample } = require('./utils');

/**
 * @typedef {import('./app').DataSources} DataSources
 * @typedef {import('express').Request & { dataSources: DataSources }} Request
 */

router.get('/', (req, res) => {
  res.json({ success: true });
});

router.get(
  '/next-sample',
  /** @param {Request} req */
  async (req, res) => {
    const sampleHours = await req.dataSources.schedule.fetchSchedule();
    const duration = getDurationUntilNextSample(sampleHours);
    return res.json({
      minutes: duration.asMinutes(),
    });
  }
);

router.post(
  '/sample',
  /** @param {Request} req */
  async (req, res) => {
    const { boardId, reading, sensorId } = req.body;
    if (!boardId || !reading) return res.sendStatus(400);
    await req.dataSources.samples.writeSample({ boardId, sensorId, reading });
    res.sendStatus(200);
  }
);

router.post(
  '/samples',
  /** @param {Request} req */
  async ({ body, dataSources: { samples, schedule } }, res) => {
    /** @typedef {{ id: number; readings: number[] }} Board */
    /** @type {{ boards: Board[] }} */
    const { boards } = body;

    const formattedSamples = boards.map(({ id, readings }) => {
      return readings.map((reading, sensorId) => {
        return { boardId: id, sensorId, reading };
      });
    });
    const flattenedSamples = formattedSamples.reduce(
      (acc, group) => [...acc, ...group],
      []
    );
    await samples.writeSamples(flattenedSamples);
    const sampleHours = await schedule.fetchSchedule();
    const duration = getDurationUntilNextSample(sampleHours);
    res.status(201);
    return res.json({
      minutes: duration.asMinutes(),
    });
  }
);

module.exports = router;
