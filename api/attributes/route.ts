import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const attributes = await prisma.attribute.findMany({
    include: {
      category: true
    }
  });

  return NextResponse.json(attributes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { name, type, categoryId } = data;

  const attribute = await prisma.attribute.create({
    data: {
      name,
      type,
      category: { connect: { id: categoryId } }
    },
    include: {
      category: true
    }
  });

  return NextResponse.json(attribute);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { id, name, type, categoryId } = data;

  const attribute = await prisma.attribute.update({
    where: { id },
    data: {
      name,
      type,
      category: { connect: { id: categoryId } }
    },
    include: {
      category: true
    }
  });

  return NextResponse.json(attribute);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.attribute.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'Attribute deleted successfully' });
}
