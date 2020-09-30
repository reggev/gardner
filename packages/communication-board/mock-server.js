const express = require('express');
const { json } = require('express');
const logger = require('morgan');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(logger('dev'));

app.get('/schedule/next-sample', (req, res) => res.json({ minutes: 0.1 }));

app.post('/samples', (req, res) => {
  console.log(req.body);
  return res.json({ minutes: 0.1 });
});

app.get('/', (req, res) => {
  res.json({
    links: {
      nextSample: {
        href: '/schedule/next-sample',
        method: 'GET',
      },
      schedule: {
        href: '/schedule',
        method: 'GET',
      },
      postSchedule: {
        href: '/schedule',
        method: 'POST',
      },
      postSample: {
        href: '/sample',
        method: 'POST',
      },
      postSamples: {
        href: '/samples',
        method: 'POST',
      },
    },
  });
});

app.listen(PORT, () => {
  console.info(`running on port ${PORT}\n\t press ctrl+c to stop...`);
});
