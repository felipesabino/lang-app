import { error } from "console";
import { Story } from "./model/story-dynamodb";
import { TranslateClient, DescribeTextTranslationJobCommand } from '@aws-sdk/client-translate';

const translateClient = new TranslateClient({});

export interface CheckTranslateStatusEnvironmentVariables {
  TRANSLATION_BUCKET_NAME: string;
}

export const handler = async (event: {metadata: Story, translateJobId: string}): Promise<{metadata: Story, translateJobId: string, translateOutputFolderUri: string, completed: boolean}> => {

  const output = await translateClient.send(new DescribeTextTranslationJobCommand({
    JobId: event.translateJobId
  }));

  const completed = output.TextTranslationJobProperties?.JobStatus === 'COMPLETED'
  const translateOutputFolderUri = output.TextTranslationJobProperties?.OutputDataConfig?.S3Uri + '';

  return { metadata: event.metadata, translateJobId: event.translateJobId, translateOutputFolderUri , completed };
}