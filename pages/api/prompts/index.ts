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
      return getPrompts(req, res);
    case 'POST':
      return createPrompt(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getPrompts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prompts = await prisma.prompt.findMany();
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prompts', error });
  }
}

async function createPrompt(req: NextApiRequest, res: NextApiResponse) {
  const { name, content, type } = req.body;

  if (!name || !content || !type) {
    return res.status(400).json({ message: 'Name, content, and type are required' });
  }

  try {
    const prompt = await prisma.prompt.create({
      data: {
        name,
        content,
        type,
      },
    });
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Error creating prompt', error });
  }
}

