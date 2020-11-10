const { Router } = require('express');
const { getDurationUntilNextSample } = require('./../utils');
const { StatusCodes } = require('http-status-codes');
const router = Router();

/**
 * @typedef {import('./../app').DataSources} DataSources
 * @typedef {import('./../types.d').Request} Request
 */
/**
 * @template Body
 * @typedef {import('./../types.d').PostRequest<Body>} PostRequest
 */

router.get(
  '/next-sample',
  /** @param {Request} req */
  async (req, res) => {
    const sampleHours = await req.dataSources.schedule.fetch();
    const duration = getDurationUntilNextSample(sampleHours);
    return res.json({
      minutes: duration.asMinutes(),
    });
  }
);

router.get(
  '/',
  /** @param {Request} req */
  async (req, res) => {
    const schedule = await req.dataSources.schedule.fetch();
    return res.json({ schedule });
  }
);

router.post(
  '/',
  /** @param {PostRequest<{ schedule?: number[]; every?: number }>} req */
  async (req, res) => {
    const { schedule, every } = req.body;
    let nextSchedule;
    if (schedule) {
      if (!Array.isArray(schedule)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'schedule must be an array of numbers(hours to sample)',
        });
      }
      if (schedule.length === 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'you provided an empty schedule' });
      }
      const _schedule = [...new Set(schedule)].sort();
      if (_schedule[_schedule.length - 1] > 24) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'you provided a schedule for more than 24 hours' });
      }
      nextSchedule = await req.dataSources.schedule.set(_schedule);
    } else if (every) {
      try {
        nextSchedule = await req.dataSources.schedule.setEvery(every);
      } catch (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: error.message });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'you must provide either every: <hours>, or schedule: [<hours>]',
      });
    }
    res.status(StatusCodes.CREATED).json({ schedule: nextSchedule });
  }
);

module.exports = router;
