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
      return getDebugInfo(req, res);
    case 'POST':
      return toggleDebugMode(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getDebugInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const debugMode = await prisma.systemSetting.findUnique({
      where: { key: 'debugMode' },
    });

    const recentLogs = await prisma.systemLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      debugMode: debugMode?.value === 'true',
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching debug info', error });
  }
}

async function toggleDebugMode(req: NextApiRequest, res: NextApiResponse) {
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    await prisma.systemSetting.upsert({
      where: { key: 'debugMode' },
      update: { value: enabled.toString() },
      create: { key: 'debugMode', value: enabled.toString() },
    });

    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: `Debug mode ${enabled ? 'enabled' : 'disabled'}`,
      },
    });

    res.status(200).json({ message: `Debug mode ${enabled ? 'enabled' : 'disabled'}` });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling debug mode', error });
  }
}