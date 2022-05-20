import jwt from 'jsonwebtoken'
import {makeAuthPolicy, HttpVerb} from './make-auth-policy'

export async function authorizer(event: any, context: any) {
  // extract the secret from the secret manager / env var
  return await handler(event.methodArn, '', event.authorizationToken)
}

export async function handler(methodArn: string, secret: string, token: string) {
  const principalId = 'user|a1b2c3d4'
  const [_arn, _partition, _executeApi, region, awsAccountId, apiDetails] = methodArn.split(':')
  const [restApiId, _stage, _method, ...resourcePath] = apiDetails.split('/')
  const apiOptions = {region, restApiId, stage: '*'}

  const resource = resourcePath.join('/')

  const authPolicy = makeAuthPolicy(principalId, awsAccountId, apiOptions)
  try {
    // verify the token
    authPolicy.allowMethod(HttpVerb.POST, resource)
  } catch (error) {
    authPolicy.denyAllMethods()
  }
  return authPolicy.build()
}
