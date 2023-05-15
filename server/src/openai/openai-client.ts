import { OpenAIApi, Configuration, CreateChatCompletionRequest } from "openai";

export class OpenAiClient {
    private readonly configuration: Configuration;

    constructor(apiKey: string) {
        this.configuration = new Configuration({apiKey});
    }

    async sendRequest(request: CreateChatCompletionRequest): Promise<string> {

        //TODO: handle error on api call
        //TODO: handle response type when finshed reason is for any reason besides feinishing processing request
        const openai = new OpenAIApi(this.configuration);
        let response;
        try {
            response = await openai.createChatCompletion(request);
        } catch (error: any) {
            throw new Error(`*Error when requesting OpenAI API: ${error.message}`);
        }
        // https://platform.openai.com/docs/guides/chat/response-format
        if (response.data.choices.length === 0 || response.data.choices[0].finish_reason !== "stop") {
            throw new Error(`No valid response from OpenAI API: ${JSON.stringify(response)}`);
        }

        return response.data.choices[0].message?.content as string;
    }

}
