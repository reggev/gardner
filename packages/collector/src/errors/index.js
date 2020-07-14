const Err = require('./Err');

module.exports = {
  unknownError: new Err('UNKNOWN_ERROR', 'unknown error'),
  failedToWriteSample: new Err(
    'FAILED_TO_WRITE_SAMPLE',
    'could not save the sample'
  ),
  failedToWriteSamples: new Err(
    'FAILED_TO_WRITE_SAMPLES',
    'could not save the samples'
  ),
};
