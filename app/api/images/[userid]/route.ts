import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ImageT } from "@/app/constants/images.constants";

export async function GET(
  request: Request, 
  { params }: { params: { userid: string } }
) {
  try {
    const supabase = await createClient();
    const { data: images, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", params.userid); 

    if (error) {
      console.error("Images fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!images || images.length === 0) {
      return notFound();
    }

    const serializedImages: ImageT[] = images.map((image) => ({
      ...image,
      id: image.id.toString(), 
      tags: image.tags || [], 
    }));

    return NextResponse.json(serializedImages); 
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to fetch images";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}