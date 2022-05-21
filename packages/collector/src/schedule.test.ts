import anyTest, {TestFn} from 'ava'
import {makeS3Client} from './s3_client'
import credentials from '../.credentials.json'
import {nextTick, updateSchedule} from './schedule.handlers'

const test = anyTest as TestFn<{
  samplesBucket: ReturnType<typeof makeS3Client>
}>

test.before((t) => {
  const samplesBucket = makeS3Client({
    bucket: 'gardner-samples-tests',
    credentials: {
      secretAccessKey: credentials['Secret access key'],
      accessKeyId: credentials['Access key ID'],
    },
  })
  t.context.samplesBucket = samplesBucket
})

test.only('should create a new schedule, and get the next tick', async (t) => {
  const nowService = () => new Date('2022-04-01 02:05:00.000')
  await updateSchedule('20 * * * *', t.context.samplesBucket, nowService)
  const {minutesTillNextRun} = await nextTick(t.context.samplesBucket, nowService)

  t.assert(minutesTillNextRun === 15)
})
