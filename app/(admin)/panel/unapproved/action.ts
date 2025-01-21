"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const fetchTempImages = async () => {
  const response = await fetch("/api/images");
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

export async function deleteUnApprovedImage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("temp_images").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/panel/unapproved");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
