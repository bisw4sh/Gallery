"use client";

import { useEffect } from "react";
import { signOutAction } from "@/app/actions";
import { waveform } from "ldrs";

export default function SignOutPage() {
  waveform.register();
  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOutAction();
        window.location.href = "/signin";
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    performSignOut();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <l-waveform size="250" stroke="35" speed="2" color="black"></l-waveform>
    </div>
  );
}
