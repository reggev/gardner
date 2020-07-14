const Err = require('./Err');
const { unknownError } = require('./index');

// express needs 4 variables for error middleware
// eslint-disable-next-line  no-unused-vars
module.exports = (err, req, res, next) => {
  if (Err.isErr(err)) {
    const { status, ...rest } = err;
    res.status(status).json(rest);
  } else {
    console.error(err);
    const { status, ...rest } = unknownError;
    res.status(status).json(rest);
  }
};
