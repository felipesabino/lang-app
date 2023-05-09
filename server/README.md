# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `yarn run build`   compile typescript to js
* `yarn run watch`   watch for changes and compile
* `yarn run test`    perform the jest unit tests
* `cdk deploy`       deploy this stack to your default AWS account/region
* `cdk diff`         compare deployed stack with current state
* `cdk synth`        emits the synthesized CloudFormation template
* `cdk bootstrap`    creates a stack includind resources needed to deploy AWS CDK apps into this environment


## Lessons Learned

- AWS Translate batch takes aroung 15 min to complete a task, even with small files (<1kb)
- AWS AppSync has no support for custom scalar types on GraphQL Schema
  - https://github.com/aws/aws-appsync-community/issues/26
  - https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html