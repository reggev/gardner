const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { getDurationUntilNextSample } = require('./../utils');
const validationMiddleware = require('./../validation.middleware');
/**
 * @typedef {import('./../app').DataSources} DataSources I
 * @typedef {{ id: number; readings: number[] }} Board
 */
/**
 * @template Body
 * @typedef {import('./../types.d').PostRequest<Body>} PostRequest
 */

const router = Router();

router.post(
  '/',
  validationMiddleware,
  /** @param {PostRequest<{ boards: Board[] }>} req */
  async ({ body, dataSources: { samples, schedule }, ...req }, res) => {
    const { boards } = body;
    const formattedSamples = boards
      .map(({ id, readings }) =>
        readings.map((reading, sensorId) => ({
          boardId: id,
          sensorId,
          reading,
        }))
      )
      .flat();
    await samples.writeSamples(formattedSamples);
    const sampleHours = await schedule.fetch();
    const duration = getDurationUntilNextSample(sampleHours);
    return res
      .status(StatusCodes.CREATED)
      .json({ minutes: duration.asMinutes() });
  }
);

module.exports = router;
