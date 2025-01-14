"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function ErrorAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.log("Error captured:", error);
      toast(error.toString());
    }
  }, [error]);
  return null;
}
