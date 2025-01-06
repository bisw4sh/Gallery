import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IoIosAddCircle } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QueryProvider from "@/components/QueryProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Image Gallery",
  description: "HomePage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="p-4">
          <QueryProvider>
            <nav className="pb-5 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold ">
                Gallery
              </Link>
              <div className="flex justify-center items-center gap-1">
                {user ? (
                  <Link href="/upload">
                    <IoIosAddCircle className="text-[40px] hover:fill-slate-500" />
                  </Link>
                ) : null}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Link href="/signin">
                      <FaUserCircle className="text-[36px] hover:fill-slate-500" />
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      {user?.email?.toString()}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem className="bg-rose-700 cursor-pointer">
                      {user ? (
                        <Link
                          className="flex items-center justify-between w-full"
                          href="/signout"
                        >
                          Sign Out <LogOut className="h-[1rem]" />
                        </Link>
                      ) : null}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
            {children}
          </QueryProvider>
        </main>
      </body>
    </html>
  );
}
