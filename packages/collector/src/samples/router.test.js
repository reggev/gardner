const request = require('supertest');
const { app } = require('./../app');
const moment = require('moment');
const DataSource = require('./dataSource');
const { StatusCodes } = require('http-status-codes');
jest.mock('./dataSource.js');

const dummyBoards = [
  {
    id: 1,
    readings: [1, 2, 3],
  },
  {
    id: 2,
    readings: [4, 5, 6],
  },
];

describe('samples', () => {
  afterEach(() => {});
  test('post samples and get back the time until the next sample', async () => {
    const writeSamples = jest.spyOn(DataSource.prototype, 'writeSamples');
    const response = await request(app)
      .post('/samples')
      .send({ boards: dummyBoards });
    const [firstCall] = writeSamples.mock.calls;
    const [firstArg] = firstCall;
    expect(firstArg).toMatchSnapshot();
    expect(response.body).toMatchObject({ minutes: expect.any(Number) });
  });
  test('fail sending empty samples', async () => {
    const response = await request(app).post('/samples').send({ boards: [] });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test.each([
    { id: 1, readings: [] },
    { id: 1, reading: 1 },
    { id: 1, reading: ['1'] },
    { readings: [1] },
    { id: 1 },
  ])('fail sending bad samples $1', async board => {
    const response = await request(app)
      .post('/samples')
      .send({
        boards: [board],
      });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
