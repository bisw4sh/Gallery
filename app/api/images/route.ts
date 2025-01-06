import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const images = await prisma.images.findMany();

    const serializedImages = images.map((image) => ({
      ...image,
      id: image.id.toString(),
    }));

    return NextResponse.json(serializedImages);
  } catch (error) {
    const errorMessage = (error as Error).message ?? "Failed to fetch images";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
