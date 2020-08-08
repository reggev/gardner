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
    const sampleHours = await schedule.fetch();
    const duration = getDurationUntilNextSample(sampleHours);
    res.status(201);
    return res.json({
      minutes: duration.asMinutes(),
    });
  }
);

module.exports = router;
