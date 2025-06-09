// import { LLMApi, ChatOptions, LLMModel, SpeechOptions } from "../api";
// import { getHeaders } from "../api";

// export class DataFlowApi implements LLMApi {
//   async chat(options: ChatOptions) {
//     // Get the latest user message
//     const userMessage = options.messages[options.messages.length - 1];
//     const payload = { prompt: userMessage.content };

//     // Call your API (replace with your actual endpoint)
//     const res = await fetch("https://your-dataflow-api/endpoint", {
//       method: "POST",
//       headers: {
//         ...getHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       options.onError?.(new Error("Failed to fetch image"));
//       return;
//     }

//     // Assume API returns a PNG image as a blob
//     const blob = await res.blob();
//     const imageUrl = URL.createObjectURL(blob);

//     // Return as markdown image
//     const message = `![Data Flow]( ${imageUrl} )`;
//     options.onFinish(message, res);
//   }

//   // Implement other required methods as stubs
//   async speech(options: SpeechOptions) { return new ArrayBuffer(0); }
//   async usage() { return { used: 0, total: 0 }; }
//   async models(): Promise<LLMModel[]> { return []; }
// }

import { LLMApi, ChatOptions, LLMModel, SpeechOptions } from "../api";

export class DataFlowApi implements LLMApi {
  async chat(options: ChatOptions) {
    // For testing: just return a simple message
    const message = "data flow generated";
    options.onFinish(message, undefined);
  }

  async speech(options: SpeechOptions) {
    return new ArrayBuffer(0);
  }
  async usage() {
    return { used: 0, total: 0 };
  }
  async models(): Promise<LLMModel[]> {
    return [];
  }
}
