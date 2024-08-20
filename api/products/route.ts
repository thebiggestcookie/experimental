import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      attributes: {
        include: {
          attribute: true
        }
      }
    }
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { name, description, categoryId, attributes } = data;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      category: { connect: { id: categoryId } },
      createdBy: { connect: { id: session.user.id } },
      attributes: {
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

  return NextResponse.json(product);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { id, name, description, categoryId, attributes } = data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
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

  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.product.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'Product deleted successfully' });
}
