const moment = require('moment');

/**
 * @param {number[]} samples
 * @returns {number}
 */
const getNextSample = samples => {
  const currentHour = moment().hour();
  if (currentHour >= samples[samples.length - 1]) return samples[0];
  const [x, ...xs] = samples;
  return currentHour < x ? x : getNextSample(xs);
};

/**
 * @param {number} nextSample
 * @param {number[]} samples
 */
const getNextSampleTime = (nextSample, samples) => {
  const expectedNext = moment();
  if (nextSample === samples[0]) expectedNext.add(1, 'days');
  expectedNext.set('hour', nextSample);
  expectedNext.set('minutes', 0);
  return expectedNext;
};

/** @param {import('moment').Moment} date */
const getDuration = date => {
  const diff = moment.duration(date.diff(moment()));
  return diff;
};

/** @param {number[]} samples */
const getDurationUntilNextSample = samples => {
  const nextSample = getNextSample(samples);
  const nextSampleTime = getNextSampleTime(nextSample, samples);
  return getDuration(nextSampleTime);
};

module.exports = {
  getNextSample,
  getNextSampleTime,
  getDuration,
  getDurationUntilNextSample,
};
