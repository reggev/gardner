require('express-async-errors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const samplesRouter = require('./samples.router');
const sampleRouter = require('./sample.router');
const scheduleRouter = require('./schedule.router');
const rootRouter = require('./root.router');
const swaggerUi = require('swagger-ui-express');
const errMiddleware = require('./errors/middleware');
const YAML = require('yamljs');
const dataSourcesMiddleware = require('./DataSources.middleware');
const ScheduleDatasource = require('./ScheduleDatasource');
const SamplesDatasource = require('./SamplesDatasource');

const swaggerDocument = YAML.load(path.resolve(__dirname, '..', 'api.yaml'));
const app = express();

/**
 * @typedef {{
 *   schedule: ScheduleDatasource;
 *   samples: SamplesDatasource;
 * }} DataSources
 */
const dataSources = dataSourcesMiddleware({
  schedule: new ScheduleDatasource(),
  samples: new SamplesDatasource(),
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/samples', dataSources, samplesRouter);
app.use('/sample', dataSources, sampleRouter);
app.use('/schedule', dataSources, scheduleRouter);
app.use(errMiddleware);
module.exports = { app };
