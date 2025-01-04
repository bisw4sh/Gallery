import { signOutAction } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  await signOutAction();
  return NextResponse.redirect(`${origin}/dashboard`);
}
