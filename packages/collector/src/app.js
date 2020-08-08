require('express-async-errors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router');
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

app.use('/', dataSources, router);
app.use(errMiddleware);
module.exports = { app };
