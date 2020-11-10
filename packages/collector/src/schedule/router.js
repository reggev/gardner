const { Router } = require('express');
const { getDurationUntilNextSample } = require('./../utils');
const { StatusCodes } = require('http-status-codes');
const validate = require('./../validation');
const { ajv } = require('./../validation');
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
    const isValid = validate(req.baseUrl, req.method, req.body);

    if (!isValid) {
      const [error] = ajv.errors;
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: ajv.errorsText([error]) });
    }
    const { schedule, every } = req.body;
    let nextSchedule;
    if (schedule) {
      const _schedule = [...new Set(schedule)].sort();
      nextSchedule = await req.dataSources.schedule.set(_schedule);
    } else if (every) {
      try {
        nextSchedule = await req.dataSources.schedule.setEvery(every);
      } catch (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: error.message });
      }
    }
    res.status(StatusCodes.CREATED).json({ schedule: nextSchedule });
  }
);

module.exports = router;
