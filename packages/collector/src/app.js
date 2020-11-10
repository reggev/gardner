require('express-async-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerSpec');
const {
  router: samplesRouter,
  dataSource: SamplesDatasource,
} = require('./samples');
const {
  router: scheduleRouter,
  dataSource: ScheduleDatasource,
} = require('./schedule');
const rootRouter = require('./root.router');
const errMiddleware = require('./errors/middleware');
const dataSourcesMiddleware = require('./DataSources.middleware');

const app = express();
let settingsFile;

if (process.env.NODE_ENV === 'test') {
  settingsFile = path.resolve(__dirname, '.settings.mock.json');
}

/**
 * @typedef {{
 *   schedule: ScheduleDatasource;
 *   samples: SamplesDatasource;
 * }} DataSources
 */
const dataSources = dataSourcesMiddleware({
  schedule: new ScheduleDatasource(settingsFile),
  samples: new SamplesDatasource(),
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(dataSources);
app.use('/', rootRouter);
app.use('/samples', samplesRouter);
app.use('/schedule', scheduleRouter);
app.use(errMiddleware);

module.exports = { app };
