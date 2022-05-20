import {makeS3Client} from './s3_client'
import {NowService} from './globals'
import cronParser from 'cron-parser'

const scheduleKey = `schedule.json`

export async function updateSchedule(
  expression: string,
  samplesBucket: ReturnType<typeof makeS3Client>,
  nowService: NowService,
) {
  cronParser.parseExpression(expression, {
    currentDate: nowService(),
    iterator: true,
  })

  await samplesBucket.put_file(scheduleKey, expression)

  return {}
}

// (new Date('2022-04-02 02:05:00.000') - new Date('2022-04-01 01:00:00.000')) / 1000 / 60
export async function getSchedule(
  samplesBucket: ReturnType<typeof makeS3Client>,
  nowService: NowService,
) {
  const scheduleFile = await samplesBucket.get_file(scheduleKey)
  if (!scheduleFile) {
    throw new Error('Schedule file not found')
  }

  const expression = scheduleFile?.Body?.toString() ?? ''

  if (expression === '') {
    throw new Error('Schedule file is empty')
  }

  const interval = cronParser.parseExpression(expression, {
    currentDate: nowService(),
    iterator: true,
  })

  return {expression, interval}
}

export async function nextTick(
  samplesBucket: ReturnType<typeof makeS3Client>,
  nowService: NowService,
) {
  const {interval} = await getSchedule(samplesBucket, nowService)
  const nextDate = interval.next().value.toDate()

  return {
    minutesTillNextRun: (nextDate.getTime() - nowService().getTime()) / 1000 / 60,
  }
}
