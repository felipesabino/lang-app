import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema/*.graphql",
  documents: "./schema/*.graphql",
  generates: {
    "./model/graphql-schema.ts": {
      plugins: ["typescript"],
      config: {
        strictScalars: true,
      },
    },
    "../../web/src/graphql/types-and-hooks.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
        "typescript-apollo-client-helpers",
        // {
        //   add: {
        //     content: 'import * from "@langapp/graphql";\n',
        //   },
        // },
      ],
      config: {
        strictScalars: true,
        withHooks: true,
      },
    },
  },
  config: {
    scalars: {
      AWSJSON: "string",
      AWSDate: "string",
      AWSTime: "string",
      AWSDateTime: "string",
      AWSTimestamp: "number",
      AWSEmail: "string",
      AWSURL: "string",
      AWSPhone: "string",
      AWSIPAddress: "string",
      AvailableVoices: "AvailableVoices",
    },
  },
};

export default config;
