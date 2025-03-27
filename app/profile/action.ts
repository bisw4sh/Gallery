"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ImageT } from "../constants/images.constants";

export async function deleteMyImage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User is not authenticated" };
    }

    const { data: image, error: imageError } = await supabase
      .from("images")
      .select("user_id")  
      .eq("id", id)
      .single<ImageT>();

    if (imageError || !image) {
      return { success: false, error: "Image not found" };
    }

    if (image.user_id !== user.id) {
      return { success: false, error: "You do not have permission to delete this image" };
    }

    const { error: deleteError } = await supabase
      .from("images")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Consider which path to revalidate based on your app's structure
    revalidatePath("/panel/images");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}