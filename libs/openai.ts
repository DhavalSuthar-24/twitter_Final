// libs/openai.ts
import OpenAI from 'openai';
import { OpenAIStream } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTweet(prompt: string) {
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      stream: true,
      prompt: `Generate a tweet based on the following prompt: ${prompt}`,
    });

    return OpenAIStream(response);
  } catch (error: any) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(JSON.stringify({
        name: error.name,
        status: error.status,
        headers: error.headers,
        message: error.message,
      }));
    } else {
      throw new Error('An unexpected error occurred: ' + error.message);
    }
  }
}
