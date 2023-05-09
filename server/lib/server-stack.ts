import { Stack, StackProps, Expiration, Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as AppSync from "aws-cdk-lib/aws-appsync";
import * as LambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import * as DynamoDB from "aws-cdk-lib/aws-dynamodb";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as StepFunction from "aws-cdk-lib/aws-stepfunctions";
import * as StepFunctionTasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as IAM from "aws-cdk-lib/aws-iam";
import { StoryStatusType } from "../resources/model/graphql-schema";

export class ServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ENVIRONMENT = this.node.tryGetContext("stage") || "development";
    const ASSET_SUFFIX = ENVIRONMENT === "production" ? "" : "-dev";

    /*
      API
    */
    const api = new AppSync.GraphqlApi(this, "Api", {
      name: "appsync-api",
      schema: AppSync.SchemaFile.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const dynamoDbTableStory = new DynamoDB.Table(this, "TableStory", {
      tableName: `Story${ASSET_SUFFIX}`,
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "storyId",
        type: DynamoDB.AttributeType.STRING,
      },
    });

    const lambdaStoryCreate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryCreate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/story-create.ts",
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName,
      },
    });

    const lambdaStoryStatus = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryStatus", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/story-status.ts",
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName,
      },
    });

    const lamdaStoryCreateDataSource = api.addLambdaDataSource("LambdaStoryCreateDataSource", lambdaStoryCreate);
    lamdaStoryCreateDataSource.createResolver("Mutation-CreateStory", {
      typeName: "Mutation",
      fieldName: "createStory",
    });

    const lamdaStoryStatusDataSource = api.addLambdaDataSource("LambdaStoryStatusDataSource", lambdaStoryStatus);
    lamdaStoryStatusDataSource.createResolver("Query-GetStoryStatus", {
      typeName: "Query",
      fieldName: "getStoryStatus",
    });

    dynamoDbTableStory.grantReadData(lambdaStoryStatus);
    dynamoDbTableStory.grantFullAccess(lambdaStoryCreate);

    /*
      STEP FUNCTIONS
    */

    const taskGetStoryData = new StepFunctionTasks.DynamoGetItem(this, "TaskGetStoryData", {
      table: dynamoDbTableStory,
      key: {
        storyId: StepFunctionTasks.DynamoAttributeValue.fromString(StepFunction.JsonPath.stringAt("$.storyId")),
      },
      projectionExpression: [
        new StepFunctionTasks.DynamoProjectionExpression().withAttribute("storyId"),
        new StepFunctionTasks.DynamoProjectionExpression().withAttribute("creationMetadata"),
      ],
      outputPath: "$.Item",
    });

    const bucketStoryText = new S3.Bucket(this, "BucketStoryText", {
      bucketName: `story-text-original${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

    const lambdaStoryGenerate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryGenerate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/workflow-story-generate.ts",
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
      },
    });

    bucketStoryText.grantWrite(lambdaStoryGenerate);

    const taskStoryGenerate = new StepFunctionTasks.LambdaInvoke(this, "TaskStoryGenerate", {
      lambdaFunction: lambdaStoryGenerate,
      outputPath: "$.Payload",
    });

    const bucketStoryTranslation = new S3.Bucket(this, "BucketStoryTranslation", {
      bucketName: `story-text-translation${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

    const lambdaStoryTranslate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryTranslate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/workflow-story-translate.ts",
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
        TRANSLATION_BUCKET_NAME: bucketStoryTranslation.bucketName,
      },
    });

    lambdaStoryTranslate.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["translate:TranslateText", "iam:PassRole"],
        resources: ["*"],
      })
    );
    bucketStoryText.grantRead(lambdaStoryTranslate);
    bucketStoryTranslation.grantWrite(lambdaStoryTranslate);

    const taskStoryTranslate = new StepFunctionTasks.LambdaInvoke(this, "TaskStoryTranslate", {
      lambdaFunction: lambdaStoryTranslate,
      outputPath: "$.Payload",
    });

    const bucketStoryAudio = new S3.Bucket(this, "BucketStoryAudio", {
      bucketName: `story-audio${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

    const taskParallelStoryAudio = new StepFunction.Parallel(this, "TaskParallelStoryAudio", {});

    const lambdaStoryAudio = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryAudio", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: "resources/workflow-story-audio.ts",
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      timeout: Duration.minutes(5),
      environment: {
        TRANSLATION_BUCKET_NAME: bucketStoryTranslation.bucketName,
        AUDIO_BUCKET_NAME: bucketStoryAudio.bucketName,
      },
    });

    lambdaStoryAudio.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["polly:SynthesizeSpeech", "iam:PassRole"],
        resources: ["*"],
      })
    );
    bucketStoryTranslation.grantRead(lambdaStoryAudio);
    bucketStoryAudio.grantReadWrite(lambdaStoryAudio);

    ["slow", "normal"].forEach((speed) => {
      const taskStoryAudioPass = new StepFunction.Pass(this, `TaskStoryAudioPass-${speed}`, {
        parameters: {
          speed,
          "metadata.$": "$.metadata",
        },
      });

      const taskStoryAudio = new StepFunctionTasks.LambdaInvoke(this, `TaskStoryAudio-${speed}`, {
        lambdaFunction: lambdaStoryAudio,
        outputPath: "$.Payload",
      });

      taskParallelStoryAudio.branch(taskStoryAudioPass.next(taskStoryAudio));
    });

    const taskUpdateStoryStatus = new StepFunctionTasks.DynamoUpdateItem(this, "taskUpdateStoryStatus", {
      table: dynamoDbTableStory,
      key: {
        storyId: StepFunctionTasks.DynamoAttributeValue.fromString(StepFunction.JsonPath.stringAt("$")),
      },
      inputPath: "$[0].metadata.storyId",
      expressionAttributeValues: {
        ":completed": StepFunctionTasks.DynamoAttributeValue.fromString(StoryStatusType.Completed.toString()),
      },
      expressionAttributeNames: { "#S": "status" },
      updateExpression: "SET #S = :completed",
    });

    const chain = StepFunction.Chain.start(taskGetStoryData)
      .next(taskStoryGenerate)
      .next(taskStoryTranslate)
      .next(taskParallelStoryAudio)
      .next(taskUpdateStoryStatus)
      .next(new StepFunction.Succeed(this, "Succeed"));

    const stateMachine = new StepFunction.StateMachine(this, "StateMachine", {
      definition: chain,
    });

    stateMachine.grantStartExecution(lambdaStoryCreate);
    lambdaStoryCreate.addEnvironment("STATE_MACHINE_ARN", stateMachine.stateMachineArn);
  }
}
