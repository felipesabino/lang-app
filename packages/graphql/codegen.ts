import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema/*.graphql',
  generates: {
    './model/graphql-schema.ts': {
      plugins: [
        'typescript',
        {
          add: {
            content: 'import { AvailableVoices } from "./voices";',
          },
        },
      ],
      config: {
        strictScalars: true,
        customTypesMapping: {
          'StoryCreationMetadata.voice': 'AvailableVoices',
          'CreateStoryInput.voice': 'AvailableVoices',
        },
      },
    },
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
      AvailableVoices: 'AvailableVoices',
    },
  },
};

export default config;
