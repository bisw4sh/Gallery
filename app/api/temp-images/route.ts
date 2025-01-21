import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: images, error } = await supabase
      .from("temp_images")
      .select("*");
    if (error) {
      console.log("Error to fetch images : ", error);
      throw new Error(error.message);
    }

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
