const { Router } = require('express');
const { getDurationUntilNextSample } = require('./../utils');
const { StatusCodes } = require('http-status-codes');
const validate = require('./../validation');
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
  /** @param {PostRequest<{ boards: Board[] }>} req */
  async ({ body, dataSources: { samples, schedule }, ...req }, res) => {
    const isValid = validate(req.baseUrl, req.method, body);
    if (!isValid) {
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
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
