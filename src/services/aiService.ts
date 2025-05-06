
import { Message } from "@/types";
import { toast } from "sonner";

// Default model to use for code assistance
const DEFAULT_MODEL = "gpt-4o";

// Maximum number of messages to include in the context
const MAX_CONTEXT_MESSAGES = 10;

export async function processCodeQuestion(
  messages: Message[], 
  currentFileContent: string | null, 
  currentFilePath: string | null
): Promise<string> {
  try {
    // Get API key from local storage or environment
    const apiKey = localStorage.getItem("openai_api_key");
    
    if (!apiKey) {
      return "Please set your OpenAI API key in the settings to use the code assistance features.";
    }
    
    if (!currentFileContent) {
      return "Please select a file from the repository to ask questions about its content.";
    }
    
    // Create system message with context about the file
    const fileExtension = currentFilePath?.split('.').pop()?.toLowerCase() || '';
    const systemMessage = {
      role: "system" as const, // Type assertion to ensure compatibility
      content: `You are an AI code assistant analyzing a ${fileExtension.toUpperCase()} file. 
The user is asking about this file:
\`\`\`${fileExtension}
${currentFileContent}
\`\`\`

Provide helpful, concise explanations about the code. 
If asked to generate or modify code, provide complete working solutions that follow best practices.`
    };
    
    // Prepare the messages for the API, taking only the last N messages to avoid token limits
    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    const apiMessages = [
      systemMessage,
      ...recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      
      // Check for specific error types
      if (error.error?.type === "insufficient_quota") {
        toast.error("OpenAI API quota exceeded. Please check your billing status.");
        return "Your OpenAI account has exceeded its current quota. Please check your billing details on the OpenAI website.";
      }
      
      throw new Error(error.error?.message || "Failed to get response from AI service");
    }
    
    const result = await response.json();
    return result.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
  } catch (error) {
    console.error("Error processing question:", error);
    toast.error("Failed to process your question. Please check your API key and try again.");
    return "Sorry, I encountered an error processing your question. Please check your API key and try again.";
  }
}

// Function to test if API key is valid
export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    // If we have a 401 unauthorized, it's an invalid key
    if (response.status === 401) {
      return false;
    }
    
    // If we have a 429 or quota error, the key is valid but has quota issues
    if (response.status === 429) {
      const error = await response.json();
      if (error.error?.type === "insufficient_quota") {
        toast.warning("API key is valid, but your account has exceeded its quota. Check your OpenAI billing.");
      }
      return true; // The key itself is valid
    }
    
    return response.ok;
  } catch (error) {
    console.error("Error testing API key:", error);
    return false;
  }
}
