import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IoIosAddCircle } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="p-4">
          <nav className="pb-5 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold ">
              Gallery
            </Link>
            <div className="flex justify-center items-center gap-1">
              <Link href="/add">
                <IoIosAddCircle className="text-[40px] hover:fill-slate-500" />
              </Link>
              <Link href="/signin">
                <FaUserCircle className="text-[36px] hover:fill-slate-500" />
              </Link>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
