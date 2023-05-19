import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { QueryGetSentenceExplanationArgs, SentenceExplanation, SentenceExplanationInput } from "@langapp/graphql";
import { OpenAiClient } from "../openai/openai-client";
import { getRequest as promptSentenceExplanation } from "../openai/prompts/prompt-sentence-explanation";

export const handler = async (event: any): Promise<SentenceExplanation> => {
  const { input } = event.arguments as QueryGetSentenceExplanationArgs;

  const OPENAI_API_KEY_SECRET_NAME = process.env.OPENAI_API_KEY_SECRET_NAME; // "dev/openai_api_key";
  if (!OPENAI_API_KEY_SECRET_NAME) {
    throw new Error("OPENAI_API_KEY_SECRET_NAME not set");
  }
  const OPENAI_API_KEY_SECRET_REGION = process.env.OPENAI_API_KEY_SECRET_REGION; // "dev/openai_api_key";
  if (!OPENAI_API_KEY_SECRET_REGION) {
    throw new Error("OPENAI_API_KEY_SECRET_REGION not set");
  }

  const text = await getFromOpenAi(OPENAI_API_KEY_SECRET_NAME, OPENAI_API_KEY_SECRET_REGION, input);

  return {
    sentence: input.sentence,
    explanation: text,
  };
};

const getFromOpenAi = async (
  secretName: string,
  secretRegion: string,
  input: SentenceExplanationInput
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
  const openAiRequest = promptSentenceExplanation({
    Sentence: input.sentence,
    LearningLanguage: input.language.target,
    ResponseLanguage: input.language.source,
  });
  try {
    return openaiClient.sendRequest(openAiRequest);
  } catch (error: any) {
    throw new Error(`Error on openai request: ${error.message}`);
  }
};
