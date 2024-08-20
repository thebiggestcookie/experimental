import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getLLMProviders(req, res);
    case 'POST':
      return createLLMProvider(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLLMProviders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providers = await prisma.lLMProvider.findMany({
      select: {
        id: true,
        name: true,
        baseUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching LLM providers', error });
  }
}

async function createLLMProvider(req: NextApiRequest, res: NextApiResponse) {
  const { name, apiKey, baseUrl } = req.body;

  if (!name || !apiKey) {
    return res.status(400).json({ message: 'Name and API key are required' });
  }

  try {
    const provider = await prisma.lLMProvider.create({
      data: {
        name,
        apiKey,
        baseUrl,
      },
      select: {
        id: true,
        name: true,
        baseUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error creating LLM provider', error });
  }
}

