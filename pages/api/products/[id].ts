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
      return getProduct(req, res, id as string);
    case 'PUT':
      return updateProduct(req, res, id as string);
    case 'DELETE':
      return deleteProduct(req, res, id as string);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, description, categoryId, attributes } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        attributes: {
          deleteMany: {},
          create: attributes.map((attr: any) => ({
            attributeId: attr.attributeId,
            value: attr.value,
          })),
        },
      },
      include: {
        category: true,
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
}

