const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { app } = require('./../app');
const moment = require('moment');
const settingsFile = path.resolve(__dirname, '..', '.settings.mock.json');
const defaultSchedule = [0, 1, 5, 9];

describe('schedule', () => {
  beforeEach(() => {
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSchedule));
  });

  test('get schedule', async () => {
    const res = await request(app).get('/schedule');
    expect(res.body).toHaveProperty('schedule');
    expect(res.body.schedule).toEqual(defaultSchedule);
  });

  test('get minutes until next-sample', async () => {
    const res = await request(app).get('/schedule/next-sample');
    expect(res.body).toHaveProperty('minutes');
    // add the minutes missing from now to the next sample
    const nextSampleHour = moment().add(res.body.minutes, 'minutes').hour();
    expect(defaultSchedule).toContain(nextSampleHour);
  });
  describe('setting schedule', () => {
    test('should fail posting new schedule every 7 hours', async () => {
      const res = await request(app).post('/schedule').send({ every: 7 });
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/a day cannot be divided/i);
      expect(res.status).toEqual(400);
    });

    test('should set a new schedule every 6 hours', async () => {
      const expectedSchedule = [0, 6, 12, 18];
      const res = await request(app).post('/schedule').send({ every: 6 });
      expect(res.body.schedule).toEqual(expectedSchedule);
      const fetchResponse = await request(app).get('/schedule');
      expect(fetchResponse.body.schedule).toEqual(expectedSchedule);
    });

    test.each`
      schedule          | expectedRegex
      ${[]}             | ${/empty schedule/i}
      ${[1, 2, 18, 48]} | ${/more than 24 hours/i}
      ${1}              | ${/must be an array of numbers/i}
      ${undefined}      | ${/you must provide either/i}
    `(
      'expect setting  schedule $schedule to fail',
      async ({ schedule, expectedRegex }) => {
        const res = await request(app).post('/schedule').send({ schedule });
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(expectedRegex);
        expect(res.status).toEqual(400);
      }
    );

    test('should sort and set a user defined schedule', async () => {
      const schedule = [3, 2, 4, 1, 4];
      const expectedSchedule = [1, 2, 3, 4];
      const res = await request(app).post('/schedule').send({ schedule });
      expect(res.body.schedule).toEqual(expectedSchedule);
      const fetchResponse = await request(app).get('/schedule');
      expect(fetchResponse.body.schedule).toEqual(expectedSchedule);
    });
  });
});
