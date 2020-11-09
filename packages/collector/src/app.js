require('express-async-errors');
const express = require('express');
const logger = require('morgan');
const {
  router: samplesRouter,
  dataSource: SamplesDatasource,
} = require('./samples');
const {
  router: scheduleRouter,
  dataSource: ScheduleDatasource,
} = require('./schedule');
const rootRouter = require('./root.router');
const swaggerUi = require('swagger-ui-express');
const errMiddleware = require('./errors/middleware');
const dataSourcesMiddleware = require('./DataSources.middleware');
const swaggerSpec = require('./swaggerSpec');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(logger('dev'));
app.use(express.json());
app.use(dataSources);
app.use('/', rootRouter);
app.use('/samples', samplesRouter);
app.use('/schedule', scheduleRouter);
app.use(errMiddleware);

module.exports = { app };
