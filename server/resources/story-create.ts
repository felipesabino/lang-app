import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidV4 } from 'uuid';
import { CreateStoryOutput, CreateStoryInput, StoryStatusType } from './model/graphql-schema'
import { Story } from './model/story-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));


export async function handler(event: any, context: any) : Promise<CreateStoryOutput> {
  try {

    const TABLE_NAME = process.env.STORY_TABLE;

    const storyId = uuidV4();
    const metadata = event.arguments.story as CreateStoryInput;

    await client.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        storyId,
        creationMetadata: metadata,
        generationRequestDate: +new Date(),
        lastUpdate: +new Date(),
        status: StoryStatusType.Generating
      } satisfies Story
    }));

    //TODO: trigger step functions to generate story assets

    return {
      storyId,
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}