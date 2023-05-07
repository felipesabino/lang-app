import { Story } from "./model/story-dynamodb";
import { TranslateClient, StartTextTranslationJobCommand } from '@aws-sdk/client-translate';

const translateClient = new TranslateClient({});



export const handler = async (event: {metadata: Story}): Promise<{metadata: Story, translateJobId: string}> => {

  const TEXT_BUCKET_ACCESS_ROLE_ARN = process.env.TEXT_BUCKET_ACCESS_ROLE_ARN;
  const TEXT_BUCKET_URL = process.env.TEXT_BUCKET_URL;
  const TEXT_STORY_URI = `${TEXT_BUCKET_URL}/${event.metadata.storyId}/`;

  const TRANSLATION_BUCKET_URL = process.env.TRANSLATION_BUCKET_URL;
  const URI = `${TRANSLATION_BUCKET_URL}/${event.metadata.storyId}/`;

  console.log([TEXT_BUCKET_ACCESS_ROLE_ARN, TEXT_BUCKET_URL, TEXT_STORY_URI, TRANSLATION_BUCKET_URL, URI]);

  const output = await translateClient.send(new StartTextTranslationJobCommand({
    DataAccessRoleArn: TEXT_BUCKET_ACCESS_ROLE_ARN,
    InputDataConfig: {
      ContentType: 'text/plain',
      S3Uri: TEXT_STORY_URI
    },
    OutputDataConfig: {
      S3Uri: URI
    },
    SourceLanguageCode: event.metadata.creationMetadata.language.source,
    TargetLanguageCodes: [event.metadata.creationMetadata.language.target],
    JobName: event.metadata.storyId,
  }));

  return { metadata: event.metadata, translateJobId: output.JobId + '' };
}