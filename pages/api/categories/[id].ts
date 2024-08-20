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
      return getCategory(req, res, id as string);
    case 'PUT':
      return updateCategory(req, res, id as string);
    case 'DELETE':
      return deleteCategory(req, res, id as string);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          }
        },
        children: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
}

async function updateCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, parentId } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
}

async function deleteCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
}

