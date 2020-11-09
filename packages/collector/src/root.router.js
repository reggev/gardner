const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
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
    },
  });
});

module.exports = router;
