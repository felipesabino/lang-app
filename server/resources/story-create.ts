import 'reflect-metadata'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidV4 } from 'uuid';
import { CreateStoryOutput, CreateStoryInput, StoryStatusType } from './model/graphql-schema'
import { DataMapper } from '@nova-odm/mapper';
import { Story } from './model/story-dynamodb';

const client = new DynamoDBClient({})

const mapper = new DataMapper({
  client
})

export async function handler(event: any, context: any) : Promise<CreateStoryOutput> {
  try {

    const storyId = uuidV4();
    const metadata = event.arguments.story as CreateStoryInput;


    await client.send(new PutCommand({
      TableName: 'Story',
      Item: {
        storyId,
        creationMetadata: metadata,
        generationRequestDate: +new Date(),
        lastUpdate: +new Date(),
        status: StoryStatusType.Generating
      }
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