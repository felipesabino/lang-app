import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'graphql/*.graphql',
  generates: {
    './resources/model/graphql-schema.ts': {
      plugins: [
        'typescript'
      ]
    }
  },
  config: {
    scalars: {
      AWSJSON: 'string',
      AWSDate: 'string',
      AWSTime: 'string',
      AWSDateTime: 'string',
      AWSTimestamp: 'number',
      AWSEmail: 'string',
      AWSURL: 'string',
      AWSPhone: 'string',
      AWSIPAddress: 'string',
    }
  }
}

export default config