"use server";
import { createClient } from "@/utils/supabase/server";
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
    const supabase = await createClient();
    const session = await supabase.auth.getUser();

    if (!session.data.user) {
      return { success: false, error: "User is not authenticated" };
    }

    const performerId = session.data.user.id;

    const { data: performer, error: performerError } = await supabase
      .from("users")
      .select("role")
      .eq("id", performerId)
      .single();

    if (performerError || !performer) {
      return {
        success: false,
        error: performerError?.message || "Failed to fetch performer's role",
      };
    }

    const { data: target, error: targetError } = await supabase
      .from("users")
      .select("role")
      .eq("id", id)
      .single();

    if (targetError || !target) {
      return {
        success: false,
        error: targetError?.message || "Failed to fetch target user's role",
      };
    }

    if (performer.role === "user") {
      return {
        success: false,
        error: "You do not have permission to perform this action",
      };
    }

    if (performer.role === "admin" && target.role === "admin") {
      return {
        success: false,
        error: "Admins cannot delete other admins",
      };
    }

    const { error: deleteError } = await supabase.from("users").delete().eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/panel/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error occurred when deleting a user",
    };
  }
}
