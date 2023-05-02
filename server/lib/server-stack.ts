import { App, Stack, StackProps, Expiration, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as AppSync from 'aws-cdk-lib/aws-appsync';
import * as LambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';

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

    const storyDynamoDbTable = new DynamoDB.Table(this, 'Story', {
      tableName: 'Story',
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'storyId',
        type: DynamoDB.AttributeType.STRING,
      },
    });

    const lambdaStoryCreate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryCreate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/story-create.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        STORY_TABLE: storyDynamoDbTable.tableName
      }
    });

    const lambdaStoryStatus = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryStatus", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/story-status.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        STORY_TABLE: storyDynamoDbTable.tableName
      }
    });

    const lamdaStoryCreateDataSource = api.addLambdaDataSource('LambdaStoryCreateDataSource', lambdaStoryCreate);
    lamdaStoryCreateDataSource.createResolver('Mutation-CreateStory', {
      typeName: 'Mutation',
      fieldName: 'createStory'
    });

    const lamdaStoryStatusDataSource = api.addLambdaDataSource('LambdaStoryStatusDataSource', lambdaStoryStatus);
    lamdaStoryStatusDataSource.createResolver('Query-GetStoryStatus', {
      typeName: 'Query',
      fieldName: 'getStoryStatus'
    });

    storyDynamoDbTable.grantReadData(lambdaStoryStatus);
    storyDynamoDbTable.grantFullAccess(lambdaStoryCreate)


  }
}
