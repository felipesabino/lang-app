import { CreateChatCompletionRequest } from 'openai'

export interface SentenceInfoProps {
  Sentence: string;
  LearningLanguage: string;
  ResponseLanguage: string;
}

export function getRequest(props: SentenceInfoProps): CreateChatCompletionRequest {
  const prompt = `Answer in ${JSON.stringify(
    props.ResponseLanguage
  )} with an explanation of what the sentence means and when it should be used and some examples sentences where it can be applied in the format bellow:

  Explanation: "this is an explanation"
  Examples:
    - Example 1
    - Example 2

  Do not add any other text or content besides the explanation or the examples. Do not repeat the provided sentence on your explanation.`;

  return  {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: `You are an Expert ${JSON.stringify(
          props.LearningLanguage
        )} Language Teacher talking to a beginner student. The student is trying to learn the sentence "${JSON.stringify(
          props.Sentence
        )}".`,
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 1024,
  }
}
