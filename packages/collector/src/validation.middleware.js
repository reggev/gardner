const { StatusCodes } = require('http-status-codes');
const validate = require('./validation');
const { ajv } = require('./validation');

module.exports = (req, res, next) => {
  if (req.method !== 'POST') return next();
  const isValid = validate(req.baseUrl, req.method, req.body);
  if (!isValid) {
    const [error] = ajv.errors;
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: ajv.errorsText([error]) });
  }
  return next();
};
