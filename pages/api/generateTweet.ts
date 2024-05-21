// pages/api/generateTweet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the body is parsed correctly
  if (req.method === 'POST' && !req.body) {
    res.status(400).json({ error: 'Request body is missing or improperly formatted' });
    return;
  }

  if (req.method === 'GET') {
    const defaultPrompt = "Write a short story about a robot that goes on an adventure.";
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Generate a tweet based on the following prompt: ${defaultPrompt}` },
        ],
        max_tokens: 100,
      });
      res.status(200).json({ result: response.choices[0].message.content });
    } catch (error: any) {
      console.error('An unexpected error occurred:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred', message: error.message });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Generate a tweet based on the following prompt: ${prompt}` },
      ],
      max_tokens: 100,
    });

    res.status(200).json({ result: response.choices[0].message.content });
  } catch (error: any) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      res.status(status).json({ name, status, headers, message });
    } else {
      console.error('An unexpected error occurred:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred', message: error.message });
    }
  }
}
