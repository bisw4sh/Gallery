"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (email: string, password: string) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/signup", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/signup",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (email: string, password: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/signin", error.message);
  }

  return redirect("/dashboard");
};

export const changePasswordAction = async (password: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/password/reset", "Password update failed");
  }

  encodedRedirect("success", "/password/reset", "Password updated");
};

export const forgotPasswordAction = async (email: string) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  // const callbackUrl = formData.get("callbackUrl")?.toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/password/change`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/password/forgot",
      "Could not reset password"
    );
  }

  // if (callbackUrl) {
  //   return redirect(callbackUrl);
  // }

  return encodedRedirect(
    "success",
    "/password/forgot",
    "Check your email for a link to reset your password."
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/signin");
};
