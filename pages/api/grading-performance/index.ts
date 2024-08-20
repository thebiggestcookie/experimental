import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'GRADER')) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getGradingPerformance(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getGradingPerformance(req: NextApiRequest, res: NextApiResponse) {
  const { userId, startDate, endDate } = req.query;

  try {
    const whereClause: any = {
      gradedAt: {
        gte: startDate ? new Date(startDate as string) : undefined,
        lte: endDate ? new Date(endDate as string) : undefined,
      },
    };

    if (userId) {
      whereClause.gradedBy = { id: userId as string };
    }

    const gradedProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        gradedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const performanceData = gradedProducts.reduce((acc: any, product) => {
      const graderId = product.gradedBy?.id;
      if (!graderId) return acc;

      if (!acc[graderId]) {
        acc[graderId] = {
          grader: product.gradedBy,
          totalGraded: 0,
          approved: 0,
          rejected: 0,
        };
      }

      acc[graderId].totalGraded++;
      if (product.approved) {
        acc[graderId].approved++;
      } else {
        acc[graderId].rejected++;
      }

      return acc;
    }, {});

    const performanceArray = Object.values(performanceData);

    res.status(200).json(performanceArray);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grading performance', error });
  }
}

