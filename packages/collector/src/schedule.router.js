const { Router } = require('express');
const { getDurationUntilNextSample } = require('./utils');

const router = Router();

/**
 * @typedef {import('./app').DataSources} DataSources
 * @typedef {import('express').Request & { dataSources: DataSources }} Request
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
  /** @param {Request} req */
  async (req, res) => {
    const { schedule, every } = req.body;
    let nextSchedule;
    if (schedule) {
      nextSchedule = await req.dataSources.schedule.set(schedule);
    } else if (every) {
      nextSchedule = await req.dataSources.schedule.setEvery(every);
    } else {
      return res.sendStatus(400);
    }
    res.status(201);
    res.json({ schedule: nextSchedule });
  }
);

module.exports = router;
