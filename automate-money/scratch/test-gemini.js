import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return;

  const genAI = new GoogleGenerativeAI(key);
  
  try {
    // List models is not a direct method on GoogleGenerativeAI sometimes depending on SDK, 
    // let's try calling the models endpoint or see if there is another way.
    // Actually, let's see if we can use a different model, or check if we can fetch models list.
    // Google AI Studio model names: 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.5-flash', etc.
    // Wait, let's try a curl request to list models using this API key.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Models response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('List models failed:', err);
  }
}

main().catch(console.error);
