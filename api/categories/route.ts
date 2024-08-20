import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      attributes: true
    }
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { name, parentId } = data;

  const category = await prisma.category.create({
    data: {
      name,
      parent: parentId ? { connect: { id: parentId } } : undefined
    },
    include: {
      parent: true,
      children: true,
      attributes: true
    }
  });

  return NextResponse.json(category);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { id, name, parentId } = data;

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      parent: parentId ? { connect: { id: parentId } } : { disconnect: true }
    },
    include: {
      parent: true,
      children: true,
      attributes: true
    }
  });

  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  // Check if category has children
  const categoryWithChildren = await prisma.category.findUnique({
    where: { id },
    include: { children: true }
  });

  if (categoryWithChildren?.children.length > 0) {
    return NextResponse.json({ error: 'Cannot delete category with subcategories' }, { status: 400 });
  }

  // Delete the category
  await prisma.category.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'Category deleted successfully' });
}
