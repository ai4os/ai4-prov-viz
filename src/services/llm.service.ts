import { LLMApi } from "../core/constants";
import { URLService } from "./url.service";

export class LLMService {
  urldecoder: URLService;

  constructor() {
    this.urldecoder = new URLService();
  }

  public async sendPrompt(prompt: string, render: any): Promise<string> {
    const applicationId = this.urldecoder.getApplicationIdFromURL();
    const sseResponse = await fetch(LLMApi.baseURL + LLMApi.chat, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        prompt: prompt,
        applicationId: applicationId,
      }),
    });

    if (!sseResponse.body) {
      throw new Error("Chat Response body is null");
    }
    const reader = sseResponse.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let completeResponse = "";
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) break;
      const decodedValue = decoder.decode(value); // {stream: true} if its really streaming
      console.log("decoded value: ", decodedValue)
      completeResponse += decodedValue;
      render(decodedValue);
    }
    return completeResponse;
  }
}
