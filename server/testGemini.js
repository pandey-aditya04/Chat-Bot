import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

async function test() {
  try {
    console.log('Testing Gemini API (v1) with key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    const result = await model.generateContent("Say 'Gemini is working!' if you can read this.");
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('Gemini Test Error:', error.message);
  }
}

test();
