const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { failedToWriteSample, failedToWriteSamples } = require('./errors');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_PASSWORD } = process.env;
// TODO:: consider a better place for those settings
// the settings can be a part of the constructor - each request has its own client
// or part of the app setting - a single client shared by all the requests

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
 *   boardId: number;
 *   sensorId: number;
 *   reading: number;
 * }} Sample
 * @typedef {import('@influxdata/influxdb-client').Point} Point
 */

class SamplesDatasource {
  constructor() {
    this.sampleToPoint = this.sampleToPoint.bind(this);
  }

  /** @type {(sample: Sample) => Point} */
  sampleToPoint({ boardId, sensorId, reading }) {
    return new Point('soilMoisture')
      .tag('sensorId', sensorId.toString())
      .tag('boardId', boardId.toString())
      .floatField('reading', reading);
  }

  /** @type {(sample: Sample) => Promise<boolean>} */
  async writeSample(sample) {
    const point = this.sampleToPoint(sample);
    writeApi.writePoint(point);
    try {
      /* 
         this actually writes to the db
        theres no need to hold the buffer 
       */
      await writeApi.flush();
      return true;
    } catch (error) {
      throw failedToWriteSample;
    }
  }

  /** @type {(samples: Sample[]) => Promise<boolean>} */
  async writeSamples(samples) {
    const points = samples.map(this.sampleToPoint);
    writeApi.writePoints(points);
    try {
      await writeApi.flush();
      return true;
    } catch (error) {
      throw failedToWriteSamples;
    }
  }
}

process.on('beforeExit', async () => {
  await writeApi.close();
});

module.exports = SamplesDatasource;
