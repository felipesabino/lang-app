import { CreateChatCompletionRequest } from "openai";
import { CreateStoryInput } from "@langapp/graphql";
import { normalizeLanguageName } from "@langapp/models";

export interface StoryCreationProps {
  Metadata: CreateStoryInput;
}

export function getRequest(props: StoryCreationProps): CreateChatCompletionRequest {
  const language = normalizeLanguageName(props.Metadata.language.target);
  const theme = JSON.stringify(props.Metadata.theme.toLowerCase());
  const narrationStyle = JSON.stringify(props.Metadata.narrationStyle.toLowerCase());
  const grammarOptions = (props.Metadata.gramarOptions || []).map((option) => JSON.stringify(option)).join(", ");
  const wordsOrSentences = (props.Metadata.specificWords || []).map((word) => JSON.stringify(word)).join(", ");

  const grammarOptionsPrompt = !grammarOptions ? "" : `Prefer using only ${grammarOptions} as grammar options.`;
  const wordsOrSentencesPrompt = !wordsOrSentences ? "" : `Include these words or sentences: ${wordsOrSentences}.`;

  const prompt = `Your task it to create a story for language learners.
  Use ${theme} as theme. Use a ${narrationStyle} narration style.
  ${grammarOptionsPrompt} ${wordsOrSentencesPrompt}
  Create at most 9 paragraphs. Return only the story text, do not include titles or any other text.
  The story must be in ${language} language`;

  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Act as a professional story writer.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 2048,
  };
}
