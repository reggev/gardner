import {AthenaClient} from '@aws-sdk/client-athena'

export function makeAthenaClient() {
  const client = new AthenaClient({})
  return {client}
}
