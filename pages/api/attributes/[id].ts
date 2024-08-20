import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return getAttribute(req, res, id as string);
    case 'PUT':
      return updateAttribute(req, res, id as string);
    case 'DELETE':
      return deleteAttribute(req, res, id as string);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getAttribute(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const attribute = await prisma.attribute.findUnique({
      where: { id },
    });
    if (!attribute) {
      return res.status(404).json({ message: 'Attribute not found' });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attribute', error });
  }
}

async function updateAttribute(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, type, options } = req.body;

  try {
    const attribute = await prisma.attribute.update({
      where: { id },
      data: {
        name,
        type,
        options,
      },
    });
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attribute', error });
  }
}

async function deleteAttribute(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.attribute.delete({ where: { id } });
    res.status(200).json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attribute', error });
  }
}

