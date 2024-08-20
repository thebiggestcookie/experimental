import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const metrics = await prisma.performanceMetric.findMany({
    where: {
      timestamp: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      }
    },
    orderBy: {
      timestamp: 'asc'
    }
  });

  return NextResponse.json(metrics);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { metricType, value } = data;

  const metric = await prisma.performanceMetric.create({
    data: {
      metricType,
      value
    }
  });

  return NextResponse.json(metric);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.performanceMetric.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'Performance metric deleted successfully' });
}
