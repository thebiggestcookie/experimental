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
      return getPrompt(req, res, id as string);
    case 'PUT':
      return updatePrompt(req, res, id as string);
    case 'DELETE':
      return deletePrompt(req, res, id as string);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getPrompt(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prompt', error });
  }
}

async function updatePrompt(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, content, type } = req.body;

  try {
    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        name,
        content,
        type,
      },
    });
    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Error updating prompt', error });
  }
}

async function deletePrompt(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.prompt.delete({ where: { id } });
    res.status(200).json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prompt', error });
  }
}

