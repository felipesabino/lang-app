import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function getAnswer(sentence: string, learningLanguage: string, responseLanguage: string) {

  const prompt = `Answer in ${JSON.stringify(responseLanguage)} with an explanation of what the sentence means and when it should be used and some examples sentences where it can be applied in the format bellow:

  Explanation: "this is an explanation"
  Examples: "Example1", "Example2"

  Do not add any other text or content besides the explanation or the examples. Do not repeat the provided sentence on your explanation.`;

  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: "system", content: `You are an Expert ${JSON.stringify(learningLanguage)} Language Teacher talking to a beginner student. The student is trying to learn the sentence "${JSON.stringify(sentence)}".` },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 1024,
  });

  console.log(response.data);
  return response.data.choices[0].message?.content;
}
