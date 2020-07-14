require('express-async-errors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router');
const swaggerUi = require('swagger-ui-express');
const errMiddleware = require('./errors/middleware');
const YAML = require('yamljs');

const swaggerDocument = YAML.load(path.resolve(__dirname, '..', 'api.yaml'));

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', router);
app.use(errMiddleware);
module.exports = { app };
