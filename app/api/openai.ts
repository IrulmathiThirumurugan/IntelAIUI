// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";

// export async function handle(
//   req: NextRequest,
//   { params }: { params: { path: string[] } },
// ) {
//   try {
//     const body = await req.json();

//     // Extract prompt from body (support both {prompt} and OpenAI {messages})
//     let prompt = "Describe your architecture here";
//     if (body.prompt) {
//       prompt = body.prompt;
//     } else if (body.messages && Array.isArray(body.messages)) {
//       const userMsg = [...body.messages].reverse().find((msg: any) => msg.role === "user");
//       if (userMsg && userMsg.content) {
//         prompt = userMsg.content;
//       }
//     }

//     // Set up a timeout for the fetch request (6 minutes)
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 6 * 60 * 1000); // 6 minutes

//     try {
//       // Send the prompt to your image generation API
//       const apiRes = await fetch("http://localhost:8000/generateDataFlowDiagramsss", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//         signal: controller.signal, // Pass the AbortController signal
//       });

//       clearTimeout(timeout); // Clear the timeout if the request completes

//       if (!apiRes.ok) {
//         throw new Error("Image generation API failed");
//       }

//       // Read the image as an ArrayBuffer
//       const buffer = await apiRes.arrayBuffer();

//       // Detect content type (default to image/png if not present)
//       const contentType = apiRes.headers.get("content-type") || "image/png";

//       // Convert to base64
//       const base64 = Buffer.from(buffer).toString("base64");

//       // Build the markdown image string with correct content type
//       const imageMarkdown = `![Generated Image](data:${contentType};base64,${base64})`;

//       return new NextResponse(imageMarkdown, {
//         status: 200,
//         headers: { "Content-Type": "text/plain" },
//       });
//     } catch (e) {
//       if (e.name === "AbortError") {
//         throw new Error("Request timed out");
//       }
//       throw e;
//     }
//   } catch (e) {
//     return new NextResponse("Image generation failed.", {
//       status: 500,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const body = await req.json();

    // Extract prompt from body (support both {prompt} and OpenAI {messages})
    let prompt = "Describe your architecture here";
    if (body.prompt) {
      prompt = body.prompt;
    } else if (body.messages && Array.isArray(body.messages)) {
      const userMsg = [...body.messages]
        .reverse()
        .find((msg: any) => msg.role === "user");
      if (userMsg && userMsg.content) {
        prompt = userMsg.content;
      }
    }

    // Call the image generation API with a 6-minute timeout
    const apiRes = await axios.post(
      "http://localhost:8000/generateDataFlowDiagramsss",
      { prompt },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 7 * 60 * 1000, // 6 minutes
        responseType: "arraybuffer",
      },
    );

    // Get content type, default to image/png
    const contentType = apiRes.headers["content-type"] || "image/png";

    // Convert raw data to base64 string
    const base64 = Buffer.from(apiRes.data).toString("base64");

    // Wrap the data URL in Markdown image syntax
    const imageMarkdown = `![Generated Image](data:${contentType};base64,${base64})`;

    // Return the markdown as plain text
    return new NextResponse(imageMarkdown, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e: any) {
    if (e.code === "ECONNABORTED") {
      return new NextResponse("Request timed out", { status: 504 });
    }
    return new NextResponse("Image generation failed.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
