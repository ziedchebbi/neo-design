import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const categoryIDs = await prisma.category.findMany({
      where: {
        name: { in: data.categories },
      },
      select: {
        id: true,
        name: false,
      },
    });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        featured: data.featured,
        categories: { connect: categoryIDs },
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
