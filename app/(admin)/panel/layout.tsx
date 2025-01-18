"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const BASE_PATH = "/panel";

export default function ApprovalDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="w-full">
      <nav className="w-full flex justify-evenly items-center pb-4">
        <Button
          variant={pathname === `${BASE_PATH}/approved` ? "link" : "default"}
        >
          <Link href={`${BASE_PATH}/approved`}>Approved</Link>
        </Button>
        <Button
          variant={pathname === `${BASE_PATH}/unapproved` ? "link" : "default"}
        >
          <Link href={`${BASE_PATH}/unapproved`}>Unapproved</Link>
        </Button>
        <Button
          variant={pathname === `${BASE_PATH}/users` ? "link" : "default"}
        >
          <Link href={`${BASE_PATH}/users`}>Users</Link>
        </Button>
      </nav>
      <hr />
      {children}
    </main>
  );
}
