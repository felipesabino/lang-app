import { Story } from "../model";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3client = new S3Client({});
const translateClient = new TranslateClient({});

export const handler = async (event: { metadata: Story }): Promise<{ metadata: Story }> => {
  const TEXT_BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
  const TRANSLATION_BUCKET_NAME = process.env.TRANSLATION_BUCKET_NAME;

  const metadata = event.metadata;
  const TEXT_KEY = `${metadata.storyId}/text.txt`;
  const TRANSLATION_KEY = `${metadata.storyId}/translation.txt`;

  const textObject = await s3client.send(
    new GetObjectCommand({
      Bucket: TEXT_BUCKET_NAME,
      Key: TEXT_KEY,
    })
  );

  const output = await translateClient.send(
    new TranslateTextCommand({
      // story is generated in the target language
      //  we then translate into the language the customer is using the application (the source)
      SourceLanguageCode: metadata.creationMetadata.language.target,
      TargetLanguageCode: metadata.creationMetadata.language.source,
      Text: await textObject.Body?.transformToString("utf-8"),
    })
  );

  await s3client.send(
    new PutObjectCommand({
      Bucket: TRANSLATION_BUCKET_NAME,
      Key: TRANSLATION_KEY,
      Body: output.TranslatedText,
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

  return { metadata: event.metadata };
};
