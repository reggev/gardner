const { Router } = require('express');
const { getDurationUntilNextSample } = require('./utils');

/**
 * @typedef {import('./app').DataSources} DataSources
 * @typedef {import('express').Request & { dataSources: DataSources }} Request
 */

const router = Router();

router.post(
  '/',
  /** @param {Request} req */
  async ({ body, dataSources: { samples, schedule } }, res) => {
    const { boardId, reading, sensorId } = body;
    if (!boardId || !reading) return res.sendStatus(400);
    await samples.writeSample({ boardId, sensorId, reading });
    const sampleHours = await schedule.fetch();
    const duration = getDurationUntilNextSample(sampleHours);
    res.status(201);
    return res.json({
      minutes: duration.asMinutes(),
    });
  }
);

module.exports = router;
