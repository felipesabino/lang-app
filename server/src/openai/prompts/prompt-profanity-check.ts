import { CreateChatCompletionRequest } from "openai";

export interface ProfanityCheckProps {
  Sentence: string;
}

export function getRequest(props: ProfanityCheckProps): CreateChatCompletionRequest {
  const prompt = `Validate the following input: "${JSON.stringify(props.Sentence)}"
  Valid answers:
  - "Invalid": if the provided input contains any profanity
  - "Valid": if the input is safe
  Do not add any explanation in the response.`;

  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Act as a content moderator validating user input",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 30,
  };
}
