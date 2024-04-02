import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}
