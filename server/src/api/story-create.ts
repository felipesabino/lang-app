import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidV4 } from "uuid";
import { CreateStoryOutput, CreateStoryInput, StoryStatusType } from "@langapp/graphql";
import { Story, translateConfig } from "../model";
import * as AWS from "aws-sdk";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig);
const sfn = new AWS.StepFunctions({});

export const handler = async (event: any): Promise<CreateStoryOutput> => {
  try {
    const TABLE_NAME = process.env.STORY_TABLE;
    if (!TABLE_NAME) {
      throw new Error("TABLE_NAME not defined");
    }

    const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN;
    if (!STATE_MACHINE_ARN) {
      throw new Error("STATE_MACHINE_ARN not defined");
    }

    const storyId = uuidV4();
    const metadata = event.arguments.story as CreateStoryInput;

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          storyId,
          creationMetadata: metadata,
          generationRequestDate: +new Date(),
          lastUpdate: +new Date(),
          status: StoryStatusType.Generating,
        } satisfies Story,
      })
    );

    return new Promise<void>((resolve, reject) => {
      sfn.startExecution(
        {
          stateMachineArn: STATE_MACHINE_ARN,
          input: JSON.stringify({ storyId }),
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    }).then(() => {
      return {
        storyId,
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
