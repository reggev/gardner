const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./router');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', router);

module.exports = { app };
