import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Story } from "./model/story-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { OpenAiClient } from "./openai/openai-client";
import { getRequest as promptStoryGenerationRequest } from "./openai/prompts/prompt-story-generation";
import { CreateStoryInput } from "./model/graphql-schema";

const s3client = new S3Client({});

export const handler = async (event: Record<string, AttributeValue>): Promise<{ metadata: Story }> => {
  const metadata = unmarshall(event) as Story;

  const BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
  const KEY = `${metadata.storyId}/text.txt`;
  const OPENAI_API_KEY_SECRET_NAME = process.env.OPENAI_API_KEY_SECRET_NAME; // "dev/openai_api_key";
  if (!OPENAI_API_KEY_SECRET_NAME) {
    throw new Error("OPENAI_API_KEY_SECRET_NAME not set");
  }
  const OPENAI_API_KEY_SECRET_REGION = process.env.OPENAI_API_KEY_SECRET_REGION; // "dev/openai_api_key";
  if (!OPENAI_API_KEY_SECRET_REGION) {
    throw new Error("OPENAI_API_KEY_SECRET_REGION not set");
  }

  const text = await getStoryFromOpenAi(
    OPENAI_API_KEY_SECRET_NAME,
    OPENAI_API_KEY_SECRET_REGION,
    metadata.creationMetadata
  );

  await s3client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: KEY,
      Body: text,
      ContentType: "text/plain",
      Metadata: {
        "x-amz-meta-storyId": metadata.storyId,
        "x-amz-meta-generationRequestDate": metadata.generationRequestDate + "",
        "x-amz-meta-gramarOptions": metadata.creationMetadata.gramarOptions.join("|"),
        "x-amz-meta-language-source": metadata.creationMetadata.language.source,
        "x-amz-meta-language-target": metadata.creationMetadata.language.target,
        "x-amz-meta-theme": metadata.creationMetadata.theme,
        "x-amz-meta-narrationStyle": metadata.creationMetadata.narrationStyle,
        "x-amz-meta-specificWords": metadata.creationMetadata.specificWords.join("|"),
      },
    })
  );

  return { metadata };
};

const getStoryFromOpenAi = async (
  secretName: string,
  secretRegion: string,
  metadata: CreateStoryInput
): Promise<string> => {
  const client = new SecretsManagerClient({
    region: secretRegion,
  });

  const openaiApiKeySecret = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );

  const openaiApiKey = openaiApiKeySecret.SecretString;

  if (!openaiApiKey) {
    throw new Error("OpenAI API Key not found");
  }

  const openaiClient = new OpenAiClient(openaiApiKey);
  const openAiRequest = promptStoryGenerationRequest({ Metadata: metadata });
  try {
    return openaiClient.sendRequest(openAiRequest);
  } catch (error: any) {
    throw new Error(`Error on openai request: ${error.message}`)
  }
};
