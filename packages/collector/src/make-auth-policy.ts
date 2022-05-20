import path from 'path'
/** The policy version used for the evaluation. This should always be "2012-10-17" */
const version = '2012-10-17'

type Condition = Record<string, string>
type ConditionsMap = Record<string, Condition>

type Method = {
  resourceArn: string
  conditions?: ConditionsMap
}

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  ALL = '*',
}

export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

type Statement = {
  Action: string
  Effect: Effect
  Resource: string[]
  Condition?: Record<string, Condition>
}
/** The regular expression used to validate resource paths for the policy */
const pathRegex = new RegExp('^[/.a-zA-Z0-9-*]+$')

export function makeAuthPolicy(
  principalId: string,
  awsAccountId: string,
  {
    restApiId = '<<restApiId>>',
    region = '<<region>>',
    stage = '<<stage>>',
  }: {
    restApiId?: string
    region?: string
    stage?: string
  } = {},
) {
  const allowMethods: Method[] = []
  const denyMethods: Method[] = []

  function addMethod(effect: Effect, verb: HttpVerb, resource: string, conditions?: ConditionsMap) {
    if (!pathRegex.test(resource)) {
      throw new Error('Invalid resource path: ' + resource + '. Path should match ' + pathRegex)
    }

    const resourceArn = `arn:aws:execute-api:${region}:${awsAccountId}:${path.join(
      restApiId,
      stage,
      verb,
      resource,
    )}`

    if (effect === Effect.Allow) {
      allowMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      })
    } else if (effect === Effect.Deny) {
      denyMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      })
    }
  }

  /**
   * Returns an empty statement object prepopulated with the correct action and the
   * desired effect.
   */
  function getEmptyStatement(effect: Effect): Statement {
    return {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: [],
    }
  }

  /**
   * This function loops over an array of objects containing a resourceArn and
   * conditions statement and generates the array of statements for the policy.
   */
  function getStatementsForEffect(effect: Effect, methods: Method[]) {
    const statements = []

    if (methods.length > 0) {
      const statement = getEmptyStatement(effect)

      for (let ii = 0; ii < methods.length; ii++) {
        const curMethod = methods[ii]
        if (!curMethod.conditions) {
          statement.Resource.push(curMethod.resourceArn)
        } else {
          const conditionalStatement = getEmptyStatement(effect)
          conditionalStatement.Resource.push(curMethod.resourceArn)
          conditionalStatement.Condition = curMethod.conditions
          statements.push(conditionalStatement)
        }
      }

      if (statement.Resource.length > 0) {
        statements.push(statement)
      }
    }

    return statements
  }

  function denyAllMethods() {
    addMethod(Effect.Deny, HttpVerb.ALL, '*')
  }

  function allowAllMethods() {
    addMethod(Effect.Allow, HttpVerb.ALL, '*')
  }

  function allowMethod(verb: HttpVerb, resource: string) {
    addMethod(Effect.Allow, verb, resource)
  }

  function denyMethod(verb: HttpVerb, resource: string) {
    addMethod(Effect.Deny, verb, resource)
  }

  function allowMethodWithConditions(verb: HttpVerb, resource: string, conditions: ConditionsMap) {
    addMethod(Effect.Allow, verb, resource, conditions)
  }

  function denyMethodWithConditions(verb: HttpVerb, resource: string, conditions: ConditionsMap) {
    addMethod(Effect.Deny, verb, resource, conditions)
  }

  function build(context?: object) {
    if (allowMethods.length === 0 && denyMethods.length === 0) {
      throw new Error('No statements defined for the policy')
    }

    return {
      principalId,
      policyDocument: {
        Version: version,
        Statement: [
          ...getStatementsForEffect(Effect.Allow, allowMethods),
          ...getStatementsForEffect(Effect.Deny, denyMethods),
        ],
      },
      ...(context ? {context} : {}),
    }
  }

  return {
    // addMethod,
    // getEmptyStatement,
    // getStatementsForEffect,
    allowAllMethods,
    denyAllMethods,
    allowMethod,
    denyMethod,
    allowMethodWithConditions,
    denyMethodWithConditions,
    build,
  }
}
