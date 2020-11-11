const Ajv = require('ajv');
const AjvErrors = require('ajv-errors');
const swaggerSpec = require('./swaggerSpec');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
AjvErrors(ajv);

const routesSchema = Object.entries(swaggerSpec.paths)
  .map(([path, route]) => {
    const { post, put, patch } = route;
    return [
      path,
      {
        ...(post ? { post } : undefined),
        ...(put ? { put } : undefined),
        ...(patch ? { patch } : undefined),
      },
    ];
  })
  .filter(([, entry]) => {
    return Object.keys(entry).length > 0;
  })
  .map(([path, entry]) => [
    path,
    Object.fromEntries(
      Object.entries(entry).map(([method, { requestBody }]) => [
        method.toUpperCase(),
        body =>
          ajv.validate(
            {
              ...requestBody.content['application/json'].schema,
              ...swaggerSpec,
            },
            body
          ),
      ])
    ),
  ])
  .reduce((acc, [path, routes]) => ({ ...acc, [path]: routes }), {});

module.exports = (path, method, body) => routesSchema[path][method](body);

module.exports.ajv = ajv;
