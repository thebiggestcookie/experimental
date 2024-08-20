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
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, categoryId, attributes } = req.body;

  if (!name || !categoryId) {
    return res.status(400).json({ message: 'Name and category are required' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        attributes: {
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
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
}

