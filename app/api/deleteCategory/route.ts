import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(req: NextRequest) {
  try {
    await prisma.category.delete({
      where: {
        id: req.nextUrl.searchParams.get("id")!,
      },
    });

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
