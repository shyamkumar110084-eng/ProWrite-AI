import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ContentType, Tone, ContentLength } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert AI assistant. Your main goal is to provide answers that are natural, human-written, and exceptionally easy to understand for everyone, regardless of the requested tone or length.

**Golden Rule: Use simple, common words. Avoid jargon, complex terms, or hard words. Explain things in the simplest way possible, as if talking to a good friend.**

When responding to any question or topic, give a complete, detailed, and well-structured answer. Make it engaging and informative by using:
- Clear headings and short paragraphs.
- Bullet points and numbered lists when helpful.
- Relatable examples or short case studies.
- Simple facts, clear explanations, and easy definitions.
- A short, simple conclusion or takeaway.

**Crucial:** Always finish your sentences and paragraphs. Never leave a response incomplete or cut off mid-thought. Ensure the final output is a complete and coherent piece of writing that fulfills the user's request for length and topic.

Always keep a friendly and approachable tone. Break down complex topics into small, easy-to-digest pieces.`;

/**
 * Generates a text response from the AI for a given prompt.
 * This function uses the gemini-2.5-flash model.
 * @param prompt The user's prompt.
 * @returns The generated text response.
 */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};


export const generateContentStream = (
  type: ContentType,
  tone: Tone,
  length: ContentLength,
  keywords: string,
  customInstructions: string
) => {
  let prompt = `Write a ${length.toLowerCase()} ${type.toLowerCase()} in a ${tone.toLowerCase()} tone. Make it engaging and human-like.\n\n`;
  prompt += `Topic: "${keywords}"\n`;
  if (customInstructions.trim()) {
    prompt += `Custom Instructions: "${customInstructions}"`;
  }

  return ai.models.generateContentStream({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

let chatInstance: Chat | null = null;

export const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const sendMessageToChat = (message: string) => {
  const chat = getChatInstance();
  return chat.sendMessageStream({ message });
};
