import anyTest, {TestFn} from 'ava'
import {makeS3Client} from './s3_client'
import credentials from '../.credentials.json'
import cronParser from 'cron-parser'

const test = anyTest as TestFn<{
  schedule_file_key: string
  // scheduleBucket: ReturnType<typeof makeS3Client>
  samplesBucket: ReturnType<typeof makeS3Client>
}>

test.before((t) => {
  //   const schedule_file_key = `test_schedule_${Math.random().toString(36).substring(2, 15)}`
  //   t.context.schedule_file_key = schedule_file_key
  //   // const scheduleBucket = makeS3Client('eu-central-1', 'gardner-schedule', {
  //   //   secretAccessKey: '',
  //   //   accessKeyId: '',
  //   // })
  //   const samplesBucket = makeS3Client({
  //     bucket: 'gardner-samples-tests',
  //     credentials: {
  //       secretAccessKey: credentials['Secret access key'],
  //       accessKeyId: credentials['Access key ID'],
  //     },
  //   })
  //   // scheduleBucket.put_file(schedule_file_key, 'some-schedule')
  //   // t.context.scheduleBucket = scheduleBucket
  //   t.context.samplesBucket = samplesBucket
})

test.skip('should diff schedules', async (t) => {
  function nowService() {
    return new Date('2022-04-01 02:05:00.000')
  }
  const croneExpression = '20 * * * *'

  const interval = cronParser.parseExpression(croneExpression, {
    currentDate: nowService(),
    iterator: true,
  })
  const nextDate = interval.next().value.toDate()
  const now = nowService()

  t.assert((nextDate.getTime() - now.getTime()) / 1000 / 60 === 15)
})
