"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function ErrorAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    if (error) {
      console.log("Error captured:", error);
      toast(error.toString());
    } else if (success) {
      console.log("Error captured:", success);
      toast(success.toString());
    }
  }, [error, success]);
  return null;
}
