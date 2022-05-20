import {nowService} from './utils'
import {makeS3Client} from './s3_client'
import {getSchedule, nextTick, updateSchedule} from './schedule.handlers'

export async function runUpdateSchedule(event: {body: {expression: string}}, context: any) {
  const samplesBucket = makeS3Client({bucket: 'gardner-samples'})
  await updateSchedule(event.body.expression, samplesBucket, nowService)
  return {statusCode: 200}
}

export async function runGetSchedule(event: {body: string}, context: any) {
  const samplesBucket = makeS3Client({bucket: 'gardner-samples'})
  const {expression} = await getSchedule(samplesBucket, nowService)
  return {
    statusCode: 200,
    body: JSON.stringify({
      expression,
      now: nowService().toLocaleString(),
    }),
  }
}

export async function runNextTick(event: {body: string}, context: any) {
  const samplesBucket = makeS3Client({bucket: 'gardner-samples'})
  const {minutesTillNextRun} = await nextTick(samplesBucket, nowService)

  return {
    statusCode: 200,
    body: JSON.stringify({minutesTillNextRun}),
  }
}
