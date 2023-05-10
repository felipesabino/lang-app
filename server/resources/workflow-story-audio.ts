import { Story } from "./model/story-dynamodb";
import { OutputFormat, PollyClient, SynthesizeSpeechCommand, VoiceId } from "@aws-sdk/client-polly";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { SupportedLanguages } from "./model/graphql-schema";

const s3client = new S3Client({});
const pollyClient = new PollyClient({});

type AudioSpeeds = "slow" | "normal";

export const handler = async (event: { metadata: Story, speed: AudioSpeeds }): Promise<{ metadata: Story }> => {
  const TEXT_BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
  const AUDIO_BUCKET_NAME = process.env.AUDIO_BUCKET_NAME;
  const AUDIO_SPEED = event.speed as AudioSpeeds;

  const metadata = event.metadata;
  const AUDIO_FILE_KEY = `${metadata.storyId}/audio-${AUDIO_SPEED}.mp3`;
  const SPEECH_FILE_KEY = `${metadata.storyId}/speech-marks-${AUDIO_SPEED}.json`;
  const TRANSLATION_KEY = `${metadata.storyId}/text.txt`;

  const translationObject = await s3client.send(
    new GetObjectCommand({
      Bucket: TEXT_BUCKET_NAME,
      Key: TRANSLATION_KEY,
    })
  );

  const textSSML = generateSSML(await translationObject.Body?.transformToString("utf-8"), AUDIO_SPEED);
  const language = normalizeLanguageCode(metadata.creationMetadata.language.target);

  await generateSpeechMarks(textSSML, metadata, language, AUDIO_BUCKET_NAME, SPEECH_FILE_KEY);
  await generateAudio(textSSML, metadata, language, AUDIO_BUCKET_NAME, AUDIO_FILE_KEY);

  return { metadata: event.metadata };
};

const generateAudio = async (
  textSSML: string,
  metadata: Story,
  language: string,
  outputBuket: string | undefined,
  outputKey: string
): Promise<void> => {
  const audio = await pollyClient.send(
    new SynthesizeSpeechCommand({
      Text: textSSML,
      OutputFormat: OutputFormat.MP3,
      VoiceId: metadata.creationMetadata.voice,
      Engine: "neural", // we only use neural voices
      LanguageCode: language,
      TextType: "ssml",
      SampleRate: "24000",
    })
  );

  await s3client.send(
    new PutObjectCommand({
      Bucket: outputBuket,
      Key: outputKey,
      Body: await audio.AudioStream?.transformToByteArray(),
      ContentType: "audio/mpeg",
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
};

const generateSpeechMarks = async (
  textSSML: string,
  metadata: Story,
  language: string,
  outputBuket: string | undefined,
  outputKey: string
): Promise<void> => {
  const speechMarks = await pollyClient.send(
    new SynthesizeSpeechCommand({
      Text: textSSML,
      OutputFormat: OutputFormat.JSON,
      VoiceId: metadata.creationMetadata.voice,
      Engine: "neural", // we only use neural voices
      LanguageCode: language,
      SpeechMarkTypes: ["word", "sentence"],
      TextType: "ssml",
    })
  );

  // output is a json object per line so nneds formatting to be a valid array of json objects in a file
  // add , for each line
  // surround by [ and ]
  //  example output can be seen at https://docs.aws.amazon.com/polly/latest/dg/speechmarkexamples.html
  const marksFormatted = `[${(await speechMarks.AudioStream?.transformToString("utf-8"))?.split('\n').join(',')}]`;

  await s3client.send(
    new PutObjectCommand({
      Bucket: outputBuket,
      Key: outputKey,
      Body: marksFormatted,
      ContentType: "application/json",
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
};

const normalizeLanguageCode = (language: SupportedLanguages): string => {
  switch (language) {
    case SupportedLanguages.En:
      return "en-US";
    case SupportedLanguages.Fr:
      return "fr-FR";
    case SupportedLanguages.It:
      return "it-IT";
    case SupportedLanguages.Pt:
      return "pt-BR";
    default:
      throw new Error(`Error when normalizing language code, provided language is not supported: ${language}`);
  }
};

const generateSSML = (text: string | undefined, speed: AudioSpeeds): string => {
  if (!text) {
    throw new Error("Error when building SSML, text is null or empty");
  }
  if (speed === "slow") {
    return `<prosody rate="70%">${text}</prosody>`;
  } else if (speed === "normal") {
    return `<speak>${text}</speak>`;
  } else {
    throw new Error(`Error when building SSML, provided speed is invalid: '${speed}'`);
  }
};
