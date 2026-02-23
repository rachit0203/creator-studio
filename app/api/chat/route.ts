import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatRole = "user" | "assistant";

type IncomingMessage = {
  role?: ChatRole;
  content?: string;
};

type ChatRequestBody = {
  messages?: IncomingMessage[];
};

const MODEL_NAME = "gemini-1.5-flash";
const MAX_MESSAGES = 20;

const SYSTEM_GUIDE_PROMPT = `You are an AI Image Generation Guide for a creative SaaS platform.
Your role:
- Help users craft stronger image generation prompts.
- Suggest artistic styles, lighting, camera angles, composition ideas, and subject variations.
- Offer concise and practical prompt improvements.
- Keep tone supportive, clear, and professional.

Response format rules:
- Be concise and actionable.
- When useful, provide 3-5 prompt variations.
- Use bullet points for options.
- If user asks for a rewrite, output a "Final Prompt" block.`;

function buildGuidePrompt(messages: IncomingMessage[]) {
  // Flatten recent conversation turns into a compact transcript for the model.
  const chatTranscript = messages
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((message) => `${message.role?.toUpperCase()}: ${message.content?.trim()}`)
    .join("\n");

  return `${SYSTEM_GUIDE_PROMPT}

Conversation:
${chatTranscript}`;
}

function buildFallbackResponse(lastUserMessage: string) {
  return [
    "I can help with prompt ideas and refinements. Here are quick options to start:",
    "",
    "- Prompt direction: cinematic lighting, high-detail textures, dramatic composition, 35mm lens look",
    "- Style variation: minimalist studio render, editorial fashion photography, painterly concept art",
    `- Prompt upgrade for your request: \"${lastUserMessage}\" + add subject detail, mood, lighting, framing, and rendering style`,
    "",
    "Final Prompt:\n\"[subject], [environment], [lighting], [camera/framing], [style references], ultra-detailed, high fidelity\"",
  ].join("\n");
}

export async function POST(request: Request) {
  // Match dashboard behavior: only signed-in users can use the assistant endpoint.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
  }

  const sanitized = messages
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES);

  if (sanitized.length === 0) {
    return NextResponse.json({ error: "No valid messages were provided." }, { status: 400 });
  }

  const lastUserMessage = [...sanitized].reverse().find((message) => message.role === "user")?.content?.trim();

  if (!lastUserMessage) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (openRouterApiKey) {
    try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_GUIDE_PROMPT },
            ...sanitized.map((message) => ({ role: message.role, content: message.content })),
          ],
          temperature: 0.8,
        }),
      });

      const openRouterData = (await openRouterResponse.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      if (openRouterResponse.ok) {
        const text = openRouterData.choices?.[0]?.message?.content?.trim();
        if (text) {
          return NextResponse.json({ message: text });
        }
      }
    } catch {
      // If OpenRouter fails, continue to Gemini or fallback below.
    }
  }

  if (!apiKey) {
    // Graceful fallback keeps the feature usable in environments without model credentials.
    return NextResponse.json({ message: buildFallbackResponse(lastUserMessage) });
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(buildGuidePrompt(sanitized));
    const text = result.response.text()?.trim();

    if (!text) {
      return NextResponse.json({ message: buildFallbackResponse(lastUserMessage) });
    }

    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json(
      {
        error: "The guide is temporarily unavailable. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
