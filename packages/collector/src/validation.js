const Ajv = require('ajv');
const swaggerSpec = require('./swaggerSpec');

const ajv = new Ajv();

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
        ajv.compile({
          ...requestBody.content['application/json'].schema,
          ...swaggerSpec,
        }),
      ])
    ),
  ])
  .reduce((acc, [path, routes]) => ({ ...acc, [path]: routes }), {});

module.exports = (path, method, body) => routesSchema[path][method](body);
