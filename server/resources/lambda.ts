import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const S3 = new S3Client({});

const bucketName = process.env.BUCKET || "";

export async function handler(event: any, context: any) {
  try {
    console.log("entering Lambda");
    const data = await S3.send(new ListObjectsV2Command({ Bucket: bucketName }));
    console.log(event, data, context);
    return {
      id: +event.arguments.storyId,
      title: 'story title: ' + event.arguments.storyId,
      text: 'story text'
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify("Oops")
    }
  }
}