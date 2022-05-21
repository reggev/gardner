import {ReadStream} from 'fs'
import {makeS3Client} from './s3_client'
import {NowService} from './globals'
import cronParser from 'cron-parser'

const scheduleKey = `schedule.txt`

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

export async function getSchedule(
  samplesBucket: ReturnType<typeof makeS3Client>,
  nowService: NowService,
) {
  const scheduleFile = await samplesBucket.get_file(scheduleKey)
  if (!scheduleFile) {
    throw new Error('Schedule file not found')
  }

  const expression = await samplesBucket.streamToString(scheduleFile.Body as ReadStream)

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
