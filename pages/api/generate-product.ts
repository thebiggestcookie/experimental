import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input, step } = req.body;

  try {
    const llmProvider = await prisma.lLMProvider.findFirst({
      where: { name: 'OpenAI' },
    });

    if (!llmProvider) {
      return res.status(500).json({ message: 'LLM provider not configured' });
    }

    const configuration = new Configuration({
      apiKey: llmProvider.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    let prompt = '';
    switch (step) {
      case 'generate':
        prompt = `Generate a list of products based on the following input: ${input}`;
        break;
      case 'identify':
        prompt = `Identify the subcategory for the following product: ${input}`;
        break;
      case 'map':
        prompt = `Map attributes for the following product and subcategory: ${input}`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid step' });
    }

    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
    });

    const result = completion.data.choices[0].text?.trim();

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error in generate-product:', error);
    res.status(500).json({ message: 'Error generating product information', error });
  }
}

