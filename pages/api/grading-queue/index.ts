import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'GRADER') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getNextProductToGrade(req, res);
    case 'POST':
      return submitGradedProduct(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getNextProductToGrade(req: NextApiRequest, res: NextApiResponse) {
  try {
    const product = await prisma.product.findFirst({
      where: { gradedAt: null },
      include: {
        category: true,
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!product) {
      return res.status(404).json({ message: 'No products to grade' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product to grade', error });
  }
}

async function submitGradedProduct(req: NextApiRequest, res: NextApiResponse) {
  const { productId, approved, categoryId, attributes } = req.body;

  if (!productId || approved === undefined) {
    return res.status(400).json({ message: 'Product ID and approval status are required' });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        gradedAt: new Date(),
        approved,
        categoryId: categoryId || undefined,
        attributes: {
          deleteMany: {},
          create: attributes?.map((attr: any) => ({
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

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting graded product', error });
  }
}

