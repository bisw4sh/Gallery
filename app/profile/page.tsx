"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Minimize, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import CardSkeleton from "@/components/CardSkeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageT } from "../constants/images.constants";
import { deleteMyImage } from "./action"; // Import the server action
import { createClient } from "@/utils/supabase/client"; // Import the Supabase client

const fetchImages = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/images/${user.id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

export default function Home() {
  const [userid, setUserid] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/signin");
        return;
      }

      setUserid(user.id);
    };

    fetchUser();
  }, [router, supabase.auth]);

  const {
    data: images,
    isLoading,
    error,
  } = useQuery<ImageT[]>(["images"], fetchImages, {
    enabled: !!userid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate: deleteImageMutate } = useMutation(
    (id: string) => deleteMyImage(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["images"]);
      },
      onError: (error: Error) => {
        console.error("Error deleting image:", error.message);
      },
    }
  );

  if (error) {
    return <div>Error fetching images: {(error as Error).message}</div>;
  }

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {images?.map((image) => (
        <AlertDialog key={image.id.toString()}>
          <AlertDialogTrigger asChild>
            <div className="border rounded-lg p-3 shadow hover:shadow-lg">
              <div className="w-full flex justify-center items-center">
                <Image
                  src={image.link}
                  alt={image.title ?? "photo that couldn't be loaded"}
                  width={300}
                  height={300}
                  className="object-cover rounded w-auto h-auto"
                  priority
                />
              </div>
              <h2 className="text-lg font-semibold mt-2">{image.title}</h2>
              <p className="text-sm text-gray-600">@{image.author}</p>
              {Array.isArray(image.tags) &&
                image.tags.every((tag) => typeof tag === "string") && (
                  <section className="text-xs text-gray-500 mt-1">
                    {image.tags.map((tag: string, idx: number) => (
                      <Badge variant="secondary" key={idx}>
                        {tag}
                      </Badge>
                    ))}
                  </section>
                )}
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-screen h-screen p-20 max-w-full max-h-full bg-transparent border-none">
            {/* Hidden title for accessibility */}
            <AlertDialogTitle className="sr-only">
              Image Preview
            </AlertDialogTitle>

            <div className="relative w-full h-full">
              <Image
                src={image.link}
                alt={image.title ?? "photo that couldn't be loaded"}
                fill
                className="rounded object-contain"
                priority
              />
            </div>
            <AlertDialogCancel className="absolute top-5 right-5 z-10 border-none rounded-full w-[2.6rem] h-[2.6rem] opacity-70">
              <Minimize className="hover:scale-50" size={100} />
            </AlertDialogCancel>

            {/* Delete Button */}
            <button
              onClick={() => deleteImageMutate(image.id.toString())}
              className="absolute bottom-5 right-5 p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <Trash />
            </button>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
