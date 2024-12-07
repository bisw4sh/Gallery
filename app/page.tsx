import prisma from "@/lib/db";
import Image from "next/image";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MdCloseFullscreen } from "react-icons/md";

export interface ImageT {
  id: bigint;
  created_at: string;
  name: string;
  link: string;
  author: string;
  tags?: string[] | null;
}

export default async function Home() {
  const images = await prisma.images.findMany();

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {images.map((image) => (
        <AlertDialog key={image.id.toString()}>
          <AlertDialogTrigger asChild>
            <div className="border rounded-lg p-3 shadow hover:shadow-lg">
              <div className="w-full flex justify-center items-center">
                <Suspense fallback={<h1>This will load</h1>}>
                  <Image
                    src={image.link}
                    alt={image.name}
                    width={300}
                    height={300}
                    className="object-cover rounded"
                  />
                </Suspense>
              </div>
              <h2 className="text-lg font-semibold mt-2">{image.name}</h2>
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
            <div className="relative w-full h-full">
              <Image
                src={image.link}
                alt={image.name}
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
            <AlertDialogTitle className="hidden">{image.name}</AlertDialogTitle>
            <AlertDialogCancel className="absolute top-5 right-5 z-10 border-none rounded-full w-[2.6rem] h-[2.6rem] opacity-70">
              <MdCloseFullscreen className="hover:scale-50"/>
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
