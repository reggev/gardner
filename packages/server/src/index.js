require('dotenv').config();
const app = require('./app');

const { PORT } = process.env;

app.listen(PORT, () => {
  console.info(`
  listening on port ${PORT}\n\tpress ctrl+c to stop...
  `);
});
