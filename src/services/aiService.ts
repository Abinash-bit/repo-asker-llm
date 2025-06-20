import { Message } from "@/types";
import { toast } from "sonner";
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

// Default model to use for code assistance
const DEFAULT_MODEL = "gpt-4o";

// Maximum number of messages to include in the context
const MAX_CONTEXT_MESSAGES = 10;

const GEMINI_MODEL = "gemini-2.5-flash-lite-preview-06-17";
const GEMINI_API_KEY = "AIzaSyBmeU-ZY95pu4fT2goBQ02JrWiAJ3F2dSI";

export async function processCodeQuestion(
  messages: Message[],
  currentFileContent: string | null,
  currentFilePath: string | null
): Promise<string> {
  try {
    // Use hardcoded Gemini API key
    const apiKey = GEMINI_API_KEY;
    if (!apiKey) {
      return "Please set your Gemini API key in the settings to use the code assistance features.";
    }
    if (!currentFileContent) {
      return "Please select a file from the repository to ask questions about its content.";
    }
    // Compose the prompt
    const fileExtension = currentFilePath?.split(".").pop()?.toLowerCase() || "";
    const systemPrompt = `You are an AI code assistant analyzing a ${fileExtension.toUpperCase()} file.\nThe user is asking about this file:\n\n\u0060\u0060\u0060${fileExtension}\n${currentFileContent}\n\u0060\u0060\u0060\nProvide helpful, concise explanations about the code. If asked to generate or modify code, provide complete working solutions that follow best practices.`;
    // Only use the last N messages
    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    // Combine user chat history into a single string
    const chatHistory = recentMessages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");
    const userPrompt = `${systemPrompt}\n\nChat history:\n${chatHistory}`;
    // Gemini API call
    const ai = new GoogleGenAI({ apiKey });
    const config = {
      thinkingConfig: { thinkingBudget: 0 },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      responseMimeType: "text/plain",
    };
    const contents = [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];
    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      config,
      contents,
    });
    let result = "";
    for await (const chunk of response) {
      result += chunk.text;
    }
    return result || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error processing question:", error);
    toast.error("Failed to process your question. Please check your API key and try again.");
    return "Sorry, I encountered an error processing your question. Please check your API key and try again.";
  }
}

// Placeholder for Gemini API key test (always returns true for now)
export async function testApiKey(apiKey: string): Promise<boolean> {
  return true;
}
