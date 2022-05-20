import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import {ReadStream} from 'fs'

export function makeS3Client({
  bucket,
  region = 'eu-central-1',
  credentials,
}: {
  bucket: string
  region?: string
  credentials?: {accessKeyId: string; secretAccessKey: string}
}) {
  const s3 = new S3Client({
    region,
    ...(credentials ? {credentials} : {}),
  })

  function list_files(prefix: string) {
    return s3.send(new ListObjectsCommand({Bucket: bucket, Prefix: prefix}))
  }

  function get_file(key: string) {
    return s3.send(new GetObjectCommand({Bucket: bucket, Key: key}))
  }

  async function streamToString(stream: ReadStream) {
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString()
  }

  function put_file(key: string, payload: any) {
    return s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: payload,
      }),
    )
  }

  function drop_files(keys: string[]) {
    return s3.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.map((key) => ({Key: key})),
        },
      }),
    )
  }

  return {
    list_files,
    get_file,
    put_file,
    drop_files,
    streamToString
  }
}
