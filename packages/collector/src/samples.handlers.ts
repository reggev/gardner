import {NowService} from './globals'
import * as z from 'zod'
import {makeS3Client} from './s3_client'

export const SampleSchema = z.object({
  boardId: z.number(),
  sensorId: z.number(),
  value: z.number(),
})
export type Sample = z.TypeOf<typeof SampleSchema>

export async function postSample(
  nowService: NowService,
  samplesBucket: ReturnType<typeof makeS3Client>,
  samples: Sample[],
) {
  const now = nowService().getTime()
  const fileKey = `raw/sample-${nowService().toISOString()}.json`

  await samplesBucket.put_file(
    fileKey,
    samples
      .map((row) =>
        JSON.stringify({
          board_id: row.boardId,
          sensor_id: row.sensorId,
          value: row.value,
          update_timestamp: now,
        }),
      )
      .join('\n'),
  )
  return {}
}
