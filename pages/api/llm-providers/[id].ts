import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return getLLMProvider(req, res, id as string);
    case 'PUT':
      return updateLLMProvider(req, res, id as string);
    case 'DELETE':
      return deleteLLMProvider(req, res, id as string);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLLMProvider(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const provider = await prisma.lLMProvider.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        baseUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!provider) {
      return res.status(404).json({ message: 'LLM provider not found' });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching LLM provider', error });
  }
}

async function updateLLMProvider(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, apiKey, baseUrl } = req.body;

  try {
    const provider = await prisma.lLMProvider.update({
      where: { id },
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
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error updating LLM provider', error });
  }
}

async function deleteLLMProvider(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.lLMProvider.delete({ where: { id } });
    res.status(200).json({ message: 'LLM provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting LLM provider', error });
  }
}

