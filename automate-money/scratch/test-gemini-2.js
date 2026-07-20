import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', // let's try 2.5-flash since 2.0-flash failed/warned in previous runs or let's test 2.0-flash too
  });

  try {
    const result = await model.generateContent('Hello, are you active? Reply with YES.');
    console.log('Response:', result.response.text());
  } catch (err) {
    console.error('Gemini 2.5 flash API test failed:', err);
  }
}

main().catch(console.error);
