import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { AudioSpeed, SpeechMark, Story, StoryStatusType, QueryGetStoryByIdArgs } from './model/graphql-schema'
import { Story as StoryDb } from './model/story-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { translateConfig } from './model/dynamodb-transaltion-config';

const dbclient = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig);
const s3client = new S3Client({});

export const handler = async (event: any): Promise<Story> => {
  try {

    const TABLE_NAME = process.env.STORY_TABLE;
    if (!TABLE_NAME) { throw new Error('TABLE_NAME not defined'); }
    const TEXT_BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
    const TRANSLATION_BUCKET_NAME = process.env.TRANSLATION_BUCKET_NAME;
    const AUDIO_BUCKET_NAME = process.env.AUDIO_BUCKET_NAME;
    const AUDIO_BUCKET_URL = process.env.AUDIO_BUCKET_URL;

    const { storyId } = event.arguments as QueryGetStoryByIdArgs;
    if (!storyId) { throw new Error('storyId not defined'); }

    const TEXT_KEY = `${storyId}/text.txt`;
    const TRANSLATION_KEY = `${storyId}/translation.txt`;
    const AUDIO_SLOW_FILE_KEY = `${storyId}/audio-${AudioSpeed.Slow.toLocaleLowerCase()}.mp3`;
    const AUDIO_NORMAL_FILE_KEY = `${storyId}/audio-${AudioSpeed.Normal.toLocaleLowerCase()}.mp3`;
    const SPEECH_SLOW_FILE_KEY = `${storyId}/speech-marks-${AudioSpeed.Slow.toLocaleLowerCase()}.json`;
    const SPEECH_NORMAL_FILE_KEY = `${storyId}/speech-marks-${AudioSpeed.Normal.toLocaleLowerCase()}.json`;

    const storyDbItem = await (await dbclient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        storyId: storyId
      },
    }))).Item as StoryDb;

    const textObject = await s3client.send(new GetObjectCommand({
      Bucket: TEXT_BUCKET_NAME,
      Key: TEXT_KEY
    }));

    const translationObject = await s3client.send(new GetObjectCommand({
      Bucket: TRANSLATION_BUCKET_NAME,
      Key: TRANSLATION_KEY
    }));

    const speechMarkNormalObject = await s3client.send(new GetObjectCommand({
      Bucket: AUDIO_BUCKET_NAME,
      Key: SPEECH_NORMAL_FILE_KEY
    }));

    const speechMarkSlowObject = await s3client.send(new GetObjectCommand({
      Bucket: AUDIO_BUCKET_NAME,
      Key: SPEECH_SLOW_FILE_KEY
    }));

    const speechMarksSlow: SpeechMark[] = JSON.parse((await speechMarkSlowObject.Body?.transformToString('utf-8')) || '[]');
    const speechMarksNormal: SpeechMark[] = JSON.parse((await speechMarkNormalObject.Body?.transformToString('utf-8')) || '[]');

    return {
      storyId: storyId,
      lastUpdate: storyDbItem.lastUpdate || 0,
      generationRequestDate: storyDbItem.generationRequestDate || 0,
      status: storyDbItem.status || StoryStatusType.Generating,
      creationMetadata: storyDbItem.creationMetadata,
      assets: {
        text: await textObject.Body?.transformToString('utf-8') || '',
        translation: await translationObject.Body?.transformToString('utf-8') || '',
        audio: [
          {
            url: `${AUDIO_BUCKET_URL}${AUDIO_SLOW_FILE_KEY}`,
            speed: AudioSpeed.Slow,
            speechMarks: speechMarksSlow
          },
          {
            url: `${AUDIO_BUCKET_URL}${AUDIO_NORMAL_FILE_KEY}`,
            speed: AudioSpeed.Normal,
            speechMarks: speechMarksNormal
          }
        ]
      }
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}