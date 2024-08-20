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
      return getMetrics(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate } = req.query;

  try {
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate as string) : new Date();

    const [
      totalProducts,
      gradedProducts,
      approvedProducts,
      categories,
      attributes,
      users,
    ] = await Promise.all([
      prisma.product.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.product.count({
        where: {
          gradedAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.product.count({
        where: {
          gradedAt: {
            gte: start,
            lte: end,
          },
          approved: true,
        },
      }),
      prisma.category.count(),
      prisma.attribute.count(),
      prisma.user.count(),
    ]);

    const metrics = {
      totalProducts,
      gradedProducts,
      approvedProducts,
      categories,
      attributes,
      users,
      accuracy: gradedProducts > 0 ? (approvedProducts / gradedProducts) * 100 : 0,
    };

    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error });
  }
}

