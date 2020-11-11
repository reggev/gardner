const packageJson = require('../package.json');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
  },
};
const options = {
  swaggerDefinition,
  apis: ['./**/api.yaml'],
};

module.exports = swaggerJSDoc(options);
