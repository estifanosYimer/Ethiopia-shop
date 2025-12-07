import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const createCuratorChat = (contextProduct?: Product): Chat => {
  const ai = getClient();
  
  let systemInstruction = `
    You are "Ato Kassa", a knowledgeable and sophisticated curator for "Abyssinia Direct". 
    Your goal is to bridge the cultural gap between Ethiopia and Europe.
    
    Traits:
    - Polite, warm, and inviting.
    - Expert in Ethiopian history, art, coffee culture, and textiles.
    - You provide styling advice for European contexts (e.g., how to wear a Habesha dress to a gala in Paris).
    - You keep answers concise (under 100 words) unless asked for a story.
  `;

  if (contextProduct) {
    systemInstruction += `
      \nCURRENT CONTEXT: The user is currently looking at the product: "${contextProduct.name}".
      Product Details: ${contextProduct.detailedHistory}
      Price: ${contextProduct.currency}${contextProduct.price}.
      
      If the user asks "tell me about this" or "is it worth it", refer specifically to this item.
    `;
  } else {
    systemInstruction += `\nThe user is browsing the general store. Guide them to our collections (Fashion, Art, Home).`;
  }

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
};

export const sendMessageToCurator = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I apologize, I am having trouble connecting to the archives. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently unable to respond. Please check your connection.";
  }
};