import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getAttributes(req, res);
    case 'POST':
      return createAttribute(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getAttributes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const attributes = await prisma.attribute.findMany();
    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attributes', error });
  }
}

async function createAttribute(req: NextApiRequest, res: NextApiResponse) {
  const { name, type, options } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    const attribute = await prisma.attribute.create({
      data: {
        name,
        type,
        options: options || [],
      },
    });
    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating attribute', error });
  }
}

