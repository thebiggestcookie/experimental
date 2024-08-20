import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const chunks: Buffer[] = [];

  await new Promise((resolve, reject) => {
    const stream = Readable.from(req);
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(null));
  });

  const buffer = Buffer.concat(chunks);
  const fileContent = buffer.toString();

  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const createdProducts = await Promise.all(
      records.map(async (record: any) => {
        const { name, description, category, ...attributes } = record;

        const existingCategory = await prisma.category.findFirst({
          where: { name: category },
        });

        let categoryId;
        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const newCategory = await prisma.category.create({
            data: { name: category },
          });
          categoryId = newCategory.id;
        }

        const product = await prisma.product.create({
          data: {
            name,
            description,
            categoryId,
            attributes: {
              create: Object.entries(attributes).map(([key, value]) => ({
                attribute: {
                  connectOrCreate: {
                    where: { name: key },
                    create: { name: key, type: 'TEXT' },
                  },
                },
                value: value as string,
              })),
            },
          },
        });

        return product;
      })
    );

    res.status(200).json({ message: 'Bulk upload successful', productsCreated: createdProducts.length });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ message: 'Error processing bulk upload', error });
  }
}

