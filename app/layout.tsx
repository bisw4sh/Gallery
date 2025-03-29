import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CirclePlus, CircleUser } from "lucide-react";

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
import { Toaster } from "@/components/ui/sonner";
import ErrorAlert from "@/components/ErrorAlert";

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
                    <CirclePlus className="text-[40px] hover:fill-slate-800 hover:stroke-slate-50 hover:scale-125" />
                  </Link>
                ) : null}
                <DropdownMenu>
                  {user ? (
                    <DropdownMenuTrigger>
                      <CircleUser className="text-[36px] hover:fill-slate-800 hover:stroke-slate-50 hover:scale-125" />
                    </DropdownMenuTrigger>
                  ) : (
                    <Link href="/signin">
                      <CircleUser className="text-[36px] hover:fill-slate-800 hover:stroke-slate-50 hover:scale-125" />
                    </Link>
                  )}
                  {user && (
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {user?.email?.toString()}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/panel">Panel</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="bg-rose-700 cursor-pointer">
                        <Link
                          className="flex items-center justify-between w-full"
                          href="/signout"
                        >
                          Sign Out <LogOut className="h-[1rem]" />
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            </nav>
            {children}
          </QueryProvider>
          <ErrorAlert />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
