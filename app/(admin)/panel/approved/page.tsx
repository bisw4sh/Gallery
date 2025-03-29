"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useQuery } from "react-query";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteApprovedImage } from "./action";
import { ImageT } from "@/app/constants/images.constants";

export default function Approved() {
  const fetchImages = async () => {
    const response = await fetch("/api/images");
    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }
    return response.json();
  };
  const {
    data: images,
    isLoading,
    error,
  } = useQuery<ImageT[]>(["images"], fetchImages, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (error) {
    return <div>Error fetching images: {(error as Error).message}</div>;
  }

  if (isLoading) {
    return <p>Is loading</p>;
  }

  const handleApproveDelete = async (id: string) => {
    try {
      const result = await deleteApprovedImage(id);

      if (result.success) {
        toast.success("Image deleted successfully!");
      } else {
        toast.error(`Couldn't delete the image: ${result.error}`);
      }
    } catch (error) {
      console.error("Client Error:", error);
      toast.error(
        `An unexpected error occurred while deleting the image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <main className="w-full flex flex-col justify-center items-center gap-4">
      <h1 className="pt-4 text-xl font-semibold">Approved Images in Feed</h1>
      <div className="w-11/12 py-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Title</TableHead>
              <TableHead className="w-1/5">Image</TableHead>
              <TableHead className="w-1/5">Author</TableHead>
              <TableHead className="w-1/5">Tags</TableHead>
              <TableHead className="w-1/5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images?.map((image) => (
              <TableRow key={image.id}>
                <TableCell className="font-medium">{image?.title}</TableCell>
                <TableCell>
                  <div className="relative w-20 h-20">
                    <Image
                      src={image.link || "/placeholder.svg"}
                      alt={image?.title ?? "A photo that couldn't be loaded"}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{image?.author}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {image?.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Verify the Post</DialogTitle>
                        <DialogDescription>
                          Delete on Policy Violence or Misconduct
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                          Title: {image?.title}
                        </h2>
                        <p>Author: {image?.author}</p>
                        <div>
                          Tags:{" "}
                          {image?.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs mr-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="relative w-full h-64">
                          <Image
                            src={image.link}
                            alt={
                              image?.title ?? "A photo that couldn't be loaded"
                            }
                            fill
                            className="rounded-md"
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleApproveDelete(image.id.toString())
                          }
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationComp />
    </main>
  );
}

function PaginationComp() {
  return (
    <Pagination className="w-11/12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{1}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
