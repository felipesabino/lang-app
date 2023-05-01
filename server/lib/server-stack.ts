import { App, Stack, StackProps, Expiration, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as AppSync from 'aws-cdk-lib/aws-appsync';
import * as LambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as S3 from 'aws-cdk-lib/aws-s3';

export class ServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new AppSync.GraphqlApi(this, 'Api', {
      name: 'appsync-api',
      schema: AppSync.SchemaFile.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        }
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", {
      value: this.region
    });

    const bucket = new S3.Bucket(this, "Store");

    const handler = new LambdaNodeJs.NodejsFunction(this, "Handler", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/lambda.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(handler);

    const lamdaDataSource = api.addLambdaDataSource('lambdaDataSource', handler);

    lamdaDataSource.createResolver('getStoryById', {
      typeName: 'Query',
      fieldName: 'getStoryById'
    });

  }
}
