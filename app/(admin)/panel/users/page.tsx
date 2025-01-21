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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteUser } from "./action";
import CardSkeleton from "@/components/CardSkeleton";

interface TUser {
  id: string;
  role: "admin" | "normal";
}

export const fetchUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

export default function Unapproved() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<TUser[]>(["temp_images"], fetchUsers, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (error) {
    return <div>Error fetching images: {(error as Error).message}</div>;
  }

  if (isLoading) {
    return <p>Is loading</p>;
  }

  const handleUserBan = async (id: string) => {
    try {
      const result = await deleteUser(id);

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
      <h1 className="pt-4 text-xl font-semibold">
        Unapproved Images in waiting
      </h1>
      <div className="w-11/12 py-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">ID</TableHead>
              <TableHead className="w-1/3">Role</TableHead>
              <TableHead className="w-1/3">Show Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user?.id}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {user?.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Perform Actions on the User</DialogTitle>
                        <DialogDescription>
                          Following are the details of the inquired user.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <CardSkeleton />
                      </div>
                      <DialogFooter className="mt-4">
                        {user.role !== "admin" ? (
                          <Button variant="destructive">Ban</Button>
                        ) : (
                          <Button>Make Admin</Button>
                        )}
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
