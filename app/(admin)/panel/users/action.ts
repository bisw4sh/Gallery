"use server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const fetchUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export async function deleteUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createAdminClient();

    console.log("Deletion Attempt - User ID:", id);

    const authCheck = await supabase.auth.admin.getUserById(id);
    const usersTableCheck = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    console.log("Auth User Existence:", !!authCheck.data);
    console.log("Users Table Existence:", !!usersTableCheck.data);

    console.log("Session Revocation: Skipped (Method not available)");

    const tempImagesDelete = await supabase
      .from("temp_images")
      .delete()
      .eq("user_id", id);
    console.log("Temp Images Deletion:", tempImagesDelete.error || "Success");

    const imagesDelete = await supabase
      .from("images")
      .delete()
      .eq("user_id", id);
    console.log("Images Deletion:", imagesDelete.error || "Success");

    const usersDelete = await supabase
      .from("users")
      .delete()
      .eq("id", id);
    
    if (usersDelete.error) {
      console.error("Users Table Deletion Error:", usersDelete.error);
      return { 
        success: false, 
        error: `Users Table Deletion Failed: ${usersDelete.error.message}`
      };
    }

    const authDelete = await supabase.auth.admin.deleteUser(id);
    
    if (authDelete.error) {
      console.error("Auth Deletion Error:", authDelete.error);
      return { 
        success: false, 
        error: `Auth Deletion Failed: ${authDelete.error.message}`
      };
    }

    revalidatePath("/panel/users");

    return { 
      success: true,
      error: undefined
    };

  } catch (error) {
    console.error("Comprehensive Deletion Error:", error);
    return {
      success: false,
      error: error instanceof Error 
        ? `Unexpected Error: ${error.message}` 
        : "Comprehensive User Deletion Failed"
    };
  }
}