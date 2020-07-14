require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router');
const errMiddleware = require('./errors/middleware');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', router);
app.use(errMiddleware);
module.exports = { app };
