import * as path from "path";
import { Stack, StackProps, Expiration, Duration, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as AppSync from "aws-cdk-lib/aws-appsync";
import * as LambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import * as Cognito from "aws-cdk-lib/aws-cognito";
import * as DynamoDB from "aws-cdk-lib/aws-dynamodb";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as S3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as StepFunction from "aws-cdk-lib/aws-stepfunctions";
import * as StepFunctionTasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as IAM from "aws-cdk-lib/aws-iam";
import * as Cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as CertificateManager from "aws-cdk-lib/aws-certificatemanager";
import * as Route53 from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { StoryStatusType } from "@langapp/graphql";

export class ServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ENVIRONMENT = this.node.tryGetContext("stage") || "development";
    const ASSET_SUFFIX = ENVIRONMENT === "production" ? "" : "-dev";
    const PWD_ROOT = path.join(__dirname, "../..");
    const PWD_SERVER = `${PWD_ROOT}/server/src`;
    const PWD_API = `${PWD_SERVER}/api`;
    const PWD_WORKFLOW = `${PWD_SERVER}/workflows`;
    const PWD_GRAPHQL = `${PWD_ROOT}/packages/graphql`;
    const PWD_AUTH = `${PWD_SERVER}/authentication`;
    const PWD_WEB = `${PWD_ROOT}/web`;

    const CERTIFICATE_ARN =
      ENVIRONMENT === "production"
        ? "arn:aws:acm:us-east-1:802718048481:certificate/36647640-8f68-4add-8b26-968565e61efc"
        : "arn:aws:acm:us-east-1:802718048481:certificate/a7e0e314-4ec3-41c1-b40e-b536d8732e52";
    const DOMAIN = ENVIRONMENT === "production" ? "langapp.io" : "devo.langapp.io";
    const HOSTED_ZONE_DOMAIN = "langapp.io";
    const HOSTED_ZONE_ID = "Z0005978M3BE0TUV24KF";

    /*
      Resources (Tables, Buckets, etc)
    */

    const dynamoDbTableStory = new DynamoDB.Table(this, "TableStory", {
      tableName: `Story${ASSET_SUFFIX}`,
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "storyId",
        type: DynamoDB.AttributeType.STRING,
      },
    });

    const bucketStoryTranslation = new S3.Bucket(this, "BucketStoryTranslation", {
      bucketName: `story-text-translation${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

    const bucketStoryText = new S3.Bucket(this, "BucketStoryText", {
      bucketName: `story-text-original${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

    const bucketStoryAudio = new S3.Bucket(this, "BucketStoryAudio", {
      bucketName: `story-audio${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });

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
        new StepFunctionTasks.DynamoProjectionExpression().withAttribute("generationRequestDate"),
      ],
      outputPath: "$.Item",
    });

    const lambdaStoryGenerate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryGenerate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_WORKFLOW}/workflow-story-generate.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      timeout: Duration.minutes(5),
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
        OPENAI_API_KEY_SECRET_NAME: "openai-apikey",
        OPENAI_API_KEY_SECRET_REGION: props?.env?.region + "",
      },
    });
    bucketStoryText.grantWrite(lambdaStoryGenerate);
    lambdaStoryGenerate.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: ["*"],
      })
    );

    const taskStoryGenerate = new StepFunctionTasks.LambdaInvoke(this, "TaskStoryGenerate", {
      lambdaFunction: lambdaStoryGenerate,
      outputPath: "$.Payload",
    });

    const lambdaStoryTranslate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryTranslate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_WORKFLOW}/workflow-story-translate.ts`,
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

    const taskParallelStoryAssets = new StepFunction.Parallel(this, "TaskParallelStoryAssets", {});

    const lambdaStoryAudio = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryAudio", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_WORKFLOW}/workflow-story-audio.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      timeout: Duration.minutes(5),
      environment: {
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
        AUDIO_BUCKET_NAME: bucketStoryAudio.bucketName,
      },
    });

    lambdaStoryAudio.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["polly:SynthesizeSpeech", "iam:PassRole"],
        resources: ["*"],
      })
    );
    bucketStoryText.grantRead(lambdaStoryAudio);
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

      taskParallelStoryAssets.branch(taskStoryAudioPass.next(taskStoryAudio));
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
      .next(taskParallelStoryAssets)
      .next(taskUpdateStoryStatus)
      .next(new StepFunction.Succeed(this, "Succeed"));

    const stateMachine = new StepFunction.StateMachine(this, "StateMachine", {
      definition: chain,
    });

    /*
      AUTH cognito pool
        https://github.com/aws-samples/amazon-cognito-passwordless-email-auth/blob/master/cognito/template.yaml
    */

    const lambdaAuthDefineAuthChallenge = new LambdaNodeJs.NodejsFunction(this, "LambdaAuthDefineAuthChallenge", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_AUTH}/define-auth-challenge.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
    });

    const lambdaAuthCreateAuthChallenge = new LambdaNodeJs.NodejsFunction(this, "LambdaAuthCreateAuthChallenge", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_AUTH}/create-auth-challenge.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        SES_FROM_ADDRESS: "lang-app@sabino.me",
      },
    });
    lambdaAuthCreateAuthChallenge.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["ses:SendEmail", "iam:PassRole"],
        resources: ["*"],
      })
    );

    const lambdaAuthVerifyAuthChallengeResponse = new LambdaNodeJs.NodejsFunction(
      this,
      "LambdaAuthVerifyAuthChallengeResponse",
      {
        runtime: Lambda.Runtime.NODEJS_18_X,
        entry: `${PWD_AUTH}/verify-auth-challenge-response.ts`,
        handler: "handler",
        depsLockFilePath: "yarn.lock",
      }
    );

    const lambdaAutPreSignUp = new LambdaNodeJs.NodejsFunction(this, "LambdaAutPreSignUp", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_AUTH}/pre-signup.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
    });

    const roleAuthLambdaAutPostAuthentication = new IAM.Role(this, "Role", {
      assumedBy: new IAM.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        IAM.ManagedPolicy.fromManagedPolicyArn(
          this,
          "AWSLambdaBasicEXecutionRole",
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      roleName: "PostAuthenticationRole",
    });

    const lambdaAutPostAuthentication = new LambdaNodeJs.NodejsFunction(this, "LambdaAutPostAuthentication", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_AUTH}/post-authentication.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      role: roleAuthLambdaAutPostAuthentication,
    });

    const authUserPool = new Cognito.UserPool(this, "AppAuthUserPool", {
      userPoolName: "AppAuthUserPool",
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
      mfa: Cognito.Mfa.OFF,
      lambdaTriggers: {
        createAuthChallenge: lambdaAuthCreateAuthChallenge,
        defineAuthChallenge: lambdaAuthDefineAuthChallenge,
        preSignUp: lambdaAutPreSignUp,
        verifyAuthChallengeResponse: lambdaAuthVerifyAuthChallengeResponse,
        postAuthentication: lambdaAutPostAuthentication,
      },
      customAttributes: {
        name: new Cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 128 }),
        email: new Cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 128 }),
      },
    });

    const policyAuthSetUserAttributesPolicy = new IAM.Policy(this, "allow-set-user-attributes", {
      document: new IAM.PolicyDocument({
        statements: [
          new IAM.PolicyStatement({
            actions: ["cognito-idp:AdminUpdateUserAttributes"],
            resources: [authUserPool.userPoolArn],
          }),
        ],
      }),
      roles: [roleAuthLambdaAutPostAuthentication],
    });

    lambdaAuthCreateAuthChallenge.addPermission("PersmissionLambdaAuthCreateAuthChallengeUserPool", {
      principal: new IAM.ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: authUserPool.userPoolArn,
    });
    lambdaAuthDefineAuthChallenge.addPermission("PersmissionLambdaAuthDefineAuthChallengeUserPool", {
      principal: new IAM.ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: authUserPool.userPoolArn,
    });
    lambdaAutPreSignUp.addPermission("PersmissionLambdaAuthreSignUpUserPool", {
      principal: new IAM.ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: authUserPool.userPoolArn,
    });
    lambdaAuthVerifyAuthChallengeResponse.addPermission("PersmissionLambdaAuthVerifyAuthChallengeResponseUserPool", {
      principal: new IAM.ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: authUserPool.userPoolArn,
    });
    lambdaAutPostAuthentication.addPermission("PersmissionLambdaAuthostAuthenticationUserPool", {
      principal: new IAM.ServicePrincipal("cognito-idp.amazonaws.com"),
      action: "lambda:InvokeFunction",
      sourceArn: authUserPool.userPoolArn,
    });

    const authUserPoolClient = new Cognito.UserPoolClient(this, "AuthUserPoolClient", {
      userPoolClientName: "AuthUserPoolClient",
      userPool: authUserPool,
      generateSecret: false,
      authFlows: {
        custom: true,
      },
    });

    // Prints out the user pool id
    new CfnOutput(this, "UserPoolId", {
      value: authUserPool.userPoolId,
    });

    // Prints out the user pool client id
    new CfnOutput(this, "UserPoolClientId", {
      value: authUserPoolClient.userPoolClientId,
    });

    /*
      API
    */
    const api = new AppSync.GraphqlApi(this, "Api", {
      name: "appsync-api",
      schema: AppSync.SchemaFile.fromAsset(`${PWD_GRAPHQL}/schema/schema.graphql`),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AppSync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: authUserPool,
              defaultAction: AppSync.UserPoolDefaultAction.ALLOW,
            },
          },
        ],
      },
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

    const lambdaStoryCreate = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryCreate", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_API}/story-create.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName,
      },
    });
    stateMachine.grantStartExecution(lambdaStoryCreate);
    lambdaStoryCreate.addEnvironment("STATE_MACHINE_ARN", stateMachine.stateMachineArn);

    const lambdaStoryStatus = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryStatus", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_API}/story-status.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName,
      },
    });

    const lambdaStoryGetById = new LambdaNodeJs.NodejsFunction(this, "LambdaStoryGetById", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_API}/story-get-by-id.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        STORY_TABLE: dynamoDbTableStory.tableName,
        TEXT_BUCKET_NAME: bucketStoryText.bucketName,
        TRANSLATION_BUCKET_NAME: bucketStoryTranslation.bucketName,
        AUDIO_BUCKET_NAME: bucketStoryAudio.bucketName,
        AUDIO_BUCKET_URL: bucketStoryAudio.urlForObject(""),
      },
    });
    const lamdaStoryGetByIdDataSource = api.addLambdaDataSource("LambdaStoryGetByIdDataSource", lambdaStoryGetById);
    lamdaStoryGetByIdDataSource.createResolver("Query-getStoryById", {
      typeName: "Query",
      fieldName: "getStoryById",
    });
    dynamoDbTableStory.grantReadData(lambdaStoryGetById);
    bucketStoryText.grantRead(lambdaStoryGetById);
    bucketStoryTranslation.grantRead(lambdaStoryGetById);
    bucketStoryAudio.grantRead(lambdaStoryGetById);

    const lambdaSentenceExplanation = new LambdaNodeJs.NodejsFunction(this, "LambdaSentenceExplanation", {
      runtime: Lambda.Runtime.NODEJS_18_X,
      entry: `${PWD_API}/sentence-explanation.ts`,
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      timeout: Duration.seconds(30),
      environment: {
        OPENAI_API_KEY_SECRET_NAME: "openai-apikey",
        OPENAI_API_KEY_SECRET_REGION: props?.env?.region + "",
      },
    });
    lambdaSentenceExplanation.addToRolePolicy(
      new IAM.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: ["*"],
      })
    );

    const lamdaStoryCreateDataSource = api.addLambdaDataSource("LambdaStoryCreateDataSource", lambdaStoryCreate);
    lamdaStoryCreateDataSource.createResolver("Mutation-CreateStory", {
      typeName: "Mutation",
      fieldName: "createStory",
    });
    dynamoDbTableStory.grantFullAccess(lambdaStoryCreate);

    const lamdaStoryStatusDataSource = api.addLambdaDataSource("LambdaStoryStatusDataSource", lambdaStoryStatus);
    lamdaStoryStatusDataSource.createResolver("Query-GetStoryStatus", {
      typeName: "Query",
      fieldName: "getStoryStatus",
    });
    dynamoDbTableStory.grantReadData(lambdaStoryStatus);

    const lambdaSentenceExplanationDataSource = api.addLambdaDataSource(
      "LambdaSentenceExplanationDataSource",
      lambdaSentenceExplanation
    );
    lambdaSentenceExplanationDataSource.createResolver("Query-GetSentenceExplanation", {
      typeName: "Query",
      fieldName: "getSentenceExplanation",
    });

    // Web app

    const bucketSPAPublic = new S3.Bucket(this, "BucketSPAPublic", {
      bucketName: `langapp-public${ASSET_SUFFIX}`,
      publicReadAccess: true,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    const certificate = CertificateManager.Certificate.fromCertificateArn(this, "CertificateSPA", CERTIFICATE_ARN);

    const cloudfrontWebDistribution = new Cloudfront.CloudFrontWebDistribution(this, "CDKCRAStaticWebDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucketSPAPublic,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerCertificate: Cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [DOMAIN],
        securityPolicy: Cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        sslMethod: Cloudfront.SSLMethod.SNI,
      }),
    });

    const route53domain = new Route53.ARecord(this, "Route53Domain", {
      zone: Route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: HOSTED_ZONE_DOMAIN,
      }),
      target: Route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontWebDistribution)),
      recordName: DOMAIN,
      deleteExisting: true,
    });

    new CfnOutput(this, "Cloudfront URL", {
      value: `https://${cloudfrontWebDistribution.distributionDomainName}`,
    });

    new CfnOutput(this, "Route53 Domain", {
      value: `https://${route53domain.domainName}`,
    });

    const bucketSPADeploy = new S3Deploy.BucketDeployment(this, "BucketSPADeploy", {
      sources: [S3Deploy.Source.asset(`${PWD_WEB}/build`)],
      destinationBucket: bucketSPAPublic,
      distribution: cloudfrontWebDistribution,
      distributionPaths: ["/index.html", "/build/static/js/*.js", "/build/static/js/*.map", "/build/static/css/*.css"],
    });
  }
}
