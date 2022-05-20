import {ReadStream} from 'fs'
import anyTest, {TestFn} from 'ava'
import {makeS3Client} from './s3_client'
import {postSample} from './samples.handlers'
import credentials from '../.credentials.json'

const test = anyTest as TestFn<{
  schedule_file_key: string
  // scheduleBucket: ReturnType<typeof makeS3Client>
  samplesBucket: ReturnType<typeof makeS3Client>
}>

test.before((t) => {
  const schedule_file_key = `test_schedule_${Math.random().toString(36).substring(2, 15)}`
  t.context.schedule_file_key = schedule_file_key
  // const scheduleBucket = makeS3Client('eu-central-1', 'gardner-schedule', {
  //   secretAccessKey: '',
  //   accessKeyId: '',
  // })
  const samplesBucket = makeS3Client({
    bucket: 'gardner-samples-tests',
    credentials: {
      secretAccessKey: credentials['Secret access key'],
      accessKeyId: credentials['Access key ID'],
    },
  })
  // scheduleBucket.put_file(schedule_file_key, 'some-schedule')
  // t.context.scheduleBucket = scheduleBucket
  t.context.samplesBucket = samplesBucket
})

const nowService = () => new Date('2022-01-01 00:00:00.000')

test('test', async (t) => {
  const startTime = new Date()
  await postSample(
    nowService,
    t.context.samplesBucket,
    new Array(5).fill(0).flatMap((_, boardId) =>
      new Array(5).fill(0).map((_, sensorId) => ({
        boardId: boardId,
        sensorId: sensorId,
        value: Math.random(),
      })),
    ),
  )
  const file = await t.context.samplesBucket.get_file(
    `raw/sample-${nowService().toISOString()}.json`,
  )

  t.assert(file?.LastModified ?? startTime > startTime)

  const {Body} = file

  if (!Body) {
    throw new Error('no file')
  }

  const body = await t.context.samplesBucket.streamToString(Body as ReadStream)

  const samples = body
    .split('\n')
    .filter((row) => row !== '')
    .map((row) => JSON.parse(row))

  t.assert(samples.length === 5 * 5)
})
