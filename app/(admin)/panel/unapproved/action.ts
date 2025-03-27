"use server";

import { ImageT } from "@/app/constants/images.constants";
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

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.user.id)
      .single();

    if (roleError || !userData || userData.role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

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

export async function approveUnApprovedImage(
  id: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.user.id)
      .single();

    if (roleError || !userData || userData.role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    const { data, error } = await supabase
      .from("temp_images")
      .select("*")
      .eq("id", id)
      .single<ImageT>();

    if (error || !data) {
      return { success: false, error: error?.message ?? "Error fetching the image row from temp_images" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...imageData } = data; 

    const { error: insertError } = await supabase.from("images").insert(imageData);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    const { error: deleteError } = await supabase
      .from("temp_images")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/panel/unapproved");

    return { success: true, message: "Image approved successfully" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
