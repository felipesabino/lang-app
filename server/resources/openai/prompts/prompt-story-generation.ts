import { CreateChatCompletionRequest } from "openai";
import { CreateStoryInput } from "../../model/graphql-schema";
import { normalizeLanguageName } from "../../model/normalizeLanguage";

export interface StoryCreationProps {
  Metadata: CreateStoryInput;
}

export function getRequest(props: StoryCreationProps): CreateChatCompletionRequest {

  const language = normalizeLanguageName(props.Metadata.language.target);
  const theme = JSON.stringify(props.Metadata.theme.toLowerCase());
  const narrationStyle = JSON.stringify(props.Metadata.narrationStyle.toLowerCase());
  const grammarOptions = props.Metadata.gramarOptions.map(option => JSON.stringify(option)).join(', ');
  const wordsOrSentences = props.Metadata.specificWords.map(word => JSON.stringify(word)).join(', ');

  const prompt = `Your task it to create a story for language learners using ${language} language.
  Use ${theme} as theme. Use a ${narrationStyle} narration style.
  Prefer using only ${grammarOptions} as grammar options.
  Include these words or sentences: ${wordsOrSentences}.
  Create at most 9 paragraphs. Return only the story text, do not include titles or any other text.`;

  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Act as a professional story writer.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 2048,
  };
}
