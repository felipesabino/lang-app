import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { QueryGetStoryStatusArgs, StoryStatus } from "@langapp/graphql";
import { translateConfig } from "../model";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig);

export const handler = async (event: any): Promise<StoryStatus> => {
  try {
    const TABLE_NAME = process.env.STORY_TABLE;

    const { storyId } = event.arguments as QueryGetStoryStatusArgs;

    const record = await client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { storyId },
        AttributesToGet: ["storyId", "generationRequestDate", "lastUpdate", "status"],
      })
    );

    return {
      storyId: record.Item?.storyId,
      generationRequestDate: record.Item?.generationRequestDate,
      lastUpdate: record.Item?.lastUpdate,
      status: record.Item?.status,
    } satisfies StoryStatus;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
