import {nowService} from './utils'
import * as z from 'zod'
import sJson from 'secure-json-parse'
import {makeS3Client} from './s3_client'
import {postSample, SampleSchema} from './samples.handlers'

export async function runPostSample(event: {body: string}) {
  const body = sJson.parse(event.body, undefined, {
    protoAction: 'remove',
    constructorAction: 'remove',
  })
  const samplesBucket = makeS3Client({bucket: 'gardner-samples'})
  const samples = z.array(SampleSchema).parse(body.samples)

  // pull the schedule from the bucket
  // check when is the next sample and post minutes remaining
  await postSample(nowService, samplesBucket, samples)
  return {statusCode: 200}
}
