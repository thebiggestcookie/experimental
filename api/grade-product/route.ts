import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'GRADER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the next ungraded product
  const product = await prisma.product.findFirst({
    where: {
      gradedById: null,
      aiGenerated: true
    },
    include: {
      category: true,
      attributes: {
        include: {
          attribute: true
        }
      }
    }
  });

  if (!product) {
    return NextResponse.json({ message: 'No products to grade' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'GRADER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { productId, approved, categoryId, attributes } = data;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      gradedBy: { connect: { id: session.user.id } },
      gradedAt: new Date(),
      category: { connect: { id: categoryId } },
      attributes: {
        deleteMany: {},
        create: attributes.map((attr: { attributeId: string, value: string }) => ({
          attribute: { connect: { id: attr.attributeId } },
          value: attr.value
        }))
      }
    },
    include: {
      category: true,
      attributes: {
        include: {
          attribute: true
        }
      }
    }
  });

  // Update performance metrics
  await prisma.performanceMetric.create({
    data: {
      metricType: 'HUMAN_ACCURACY',
      value: approved ? 1 : 0
    }
  });

  return NextResponse.json(updatedProduct);
}
