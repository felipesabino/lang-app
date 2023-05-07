import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Story } from "./model/story-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3client = new S3Client({});

export const handler = async (event: Record<string, AttributeValue>): Promise<{metadata: Story}> => {
  const metadata = unmarshall(event) as Story;

  const BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
  const KEY = `${metadata.storyId}/text.txt`;

  const text = 'This is a test, final version will have an actual story text here retrieved from an external service';

  await s3client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: KEY,
    Body: text,
    ContentType: 'text/plain',
    Metadata: {
      'x-amz-meta-storyId': metadata.storyId,
      'x-amz-meta-generationRequestDate': metadata.generationRequestDate + '',
      'x-amz-meta-gramarOptions': metadata.creationMetadata.gramarOptions.join('|'),
      'x-amz-meta-language-source': metadata.creationMetadata.language.source,
      'x-amz-meta-language-target': metadata.creationMetadata.language.target,
      'x-amz-meta-theme': metadata.creationMetadata.theme,
      'x-amz-meta-narrationStyle': metadata.creationMetadata.narrationStyle,
      'x-amz-meta-specificWords': metadata.creationMetadata.specificWords.join('|'),
    }
  }));

  return { metadata };
}