const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { failedToWriteSample, failedToWriteSamples } = require('./errors');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_PASSWORD } = process.env;

const retentionPolicy = 'autogen';

const bucket = `${DB_NAME}/${retentionPolicy}`;
/** @typedef {import('@influxdata/influxdb-client').ClientOptions} ClientOptions */
const clientOptions = {
  url: `http://${DB_HOST}:${DB_PORT}`,
  token: `${DB_USER_NAME}:${DB_PASSWORD}`,
};

const influxDB = new InfluxDB(clientOptions);
const writeApi = influxDB.getWriteApi('', bucket);

/**
 * @typedef {{
 *   boardId: string;
 *   sensorId: string;
 *   signature: string;
 *   reading: number;
 * }} Sample
 * @typedef {import('@influxdata/influxdb-client').Point} Point
 */

/** @type {(sample: Sample) => Point} */
const sampleToPoint = ({ signature, boardId, sensorId, reading }) => {
  return new Point('soilMoisture')
    .tag('sensorId', sensorId)
    .tag('boardId', boardId)
    .tag('signature', signature)
    .floatField('reading', reading);
};

/** @type {(sample: Sample) => Promise<boolean>} */
const writeSample = async sample => {
  const point = sampleToPoint(sample);
  writeApi.writePoint(point);
  try {
    await writeApi.close();
    return true;
  } catch (error) {
    throw failedToWriteSample;
  }
};

/** @type {(samples: Sample[]) => Promise<boolean>} */
const writeSamples = async samples => {
  const points = samples.map(sampleToPoint);
  writeApi.writePoints(points);
  try {
    await writeApi.close();
    return true;
  } catch (error) {
    throw failedToWriteSamples;
  }
};

module.exports = { writeSample, writeSamples };
