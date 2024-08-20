import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productName } = await req.json();

  try {
    // Step 1: Generate product list
    const productListResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates product information." },
        { role: "user", content: `Generate a list of 3 product names similar to: ${productName}` }
      ],
    });

    const productList = productListResponse.choices[0].message.content.split('\n');

    // Step 2: Identify subcategory
    const subcategoryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that identifies product categories." },
        { role: "user", content: `Identify the most appropriate subcategory for this product: ${productName}` }
      ],
    });

    const subcategory = subcategoryResponse.choices[0].message.content;

    // Step 3: Map attributes
    const attributesResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that identifies product attributes." },
        { role: "user", content: `List 5 key attributes for this product: ${productName}. Format as JSON with 'name' and 'value' for each attribute.` }
      ],
    });

    const attributes = JSON.parse(attributesResponse.choices[0].message.content);

    // Save the generated product
    const product = await prisma.product.create({
      data: {
        name: productName,
        category: { connect: { name: subcategory } },
        createdBy: { connect: { id: session.user.id } },
        aiGenerated: true,
        attributes: {
          create: attributes.map((attr: { name: string, value: string }) => ({
            attribute: { connect: { name: attr.name } },
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

    return NextResponse.json({
      productList,
      subcategory,
      attributes,
      savedProduct: product
    });
  } catch (error) {
    console.error('Error generating product:', error);
    return NextResponse.json({ error: 'Failed to generate product' }, { status: 500 });
  }
}
