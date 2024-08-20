import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const llmProviders = await prisma.lLMProvider.findMany();

  return NextResponse.json(llmProviders);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { name, apiKey, baseUrl } = data;

  const llmProvider = await prisma.lLMProvider.create({
    data: {
      name,
      apiKey,
      baseUrl
    }
  });

  return NextResponse.json(llmProvider);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { id, name, apiKey, baseUrl } = data;

  const llmProvider = await prisma.lLMProvider.update({
    where: { id },
    data: {
      name,
      apiKey,
      baseUrl
    }
  });

  return NextResponse.json(llmProvider);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.lLMProvider.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'LLM Provider deleted successfully' });
}
