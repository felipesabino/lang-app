import { Stack, StackProps, Expiration, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as AppSync from 'aws-cdk-lib/aws-appsync';
import * as LambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';
import * as S3 from 'aws-cdk-lib/aws-s3'
import * as StepFunction from 'aws-cdk-lib/aws-stepfunctions';
import * as StepFunctionTasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as IAM from 'aws-cdk-lib/aws-iam';

export class ServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /*
      API
    */
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

    const dynamoDbTableStory = new DynamoDB.Table(this, 'Story', {
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
        STORY_TABLE: dynamoDbTableStory.tableName
      }
    });

    const lambdaStoryStatus = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryStatus", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/story-status.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName
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

    dynamoDbTableStory.grantReadData(lambdaStoryStatus);
    dynamoDbTableStory.grantFullAccess(lambdaStoryCreate);


    /*
      STEP FUNCTIONS
    */

    const taskGetStoryData = new StepFunctionTasks.DynamoGetItem(this, 'Get Story Data', {
      table: dynamoDbTableStory,
      key: {
        storyId: StepFunctionTasks.DynamoAttributeValue.fromString(
          StepFunction.JsonPath.stringAt('$.storyId'))
        },
      projectionExpression: [
        new StepFunctionTasks.DynamoProjectionExpression().withAttribute('storyId'),
        new StepFunctionTasks.DynamoProjectionExpression().withAttribute('creationMetadata'),
      ],
      outputPath: '$.Item',
    });

    const bucketStoryText = new S3.Bucket(this, "Story Text", {
      bucketName: 'story-text-original',
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true
    });

    const lambdaStoryGenerate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryGenerate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/workflow-story-generate.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
      }
    });

    bucketStoryText.grantWrite(lambdaStoryGenerate);

    const taskStoryGenerate = new StepFunctionTasks.LambdaInvoke(this, 'Story Generate', {
      lambdaFunction: lambdaStoryGenerate,
      outputPath: '$.Payload',
    });

    const bucketStoryTranslation = new S3.Bucket(this, "Story Translation", {
      bucketName: 'story-text-translation',
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true
    });

    const lambdaStoryTranslate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryTranslate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/workflow-story-translate.ts",
      handler: "handler",
      depsLockFilePath: 'yarn.lock',
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
        TRANSLATION_BUCKET_NAME: bucketStoryTranslation.bucketName,
      }
    });

    lambdaStoryTranslate.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["translate:TranslateText", "iam:PassRole"],
        resources: ["*"]
      })
    );
    bucketStoryText.grantRead(lambdaStoryTranslate);
    bucketStoryTranslation.grantWrite(lambdaStoryTranslate);

    const taskStoryTranslate = new StepFunctionTasks.LambdaInvoke(this, 'Story Translate', {
      lambdaFunction: lambdaStoryTranslate,
      outputPath: '$.Payload',
    });


    const chain = StepFunction.Chain.start(taskGetStoryData)
      .next(taskStoryGenerate)
      .next(taskStoryTranslate)
      .next(new StepFunction.Succeed(this, 'Succeed'));

    const stateMachine = new StepFunction.StateMachine(this, "StateMachine", {
      definition: chain
    });

    stateMachine.grantStartExecution(lambdaStoryCreate);
    lambdaStoryCreate.addEnvironment('STATE_MACHINE_ARN', stateMachine.stateMachineArn)
  }
}
