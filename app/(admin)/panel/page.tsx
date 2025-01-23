"use client";
import { trefoil } from "ldrs";

export default function ApprovalDashboard() {
  trefoil.register();
  return (
    <main className="w-full flex justify-center items-center h-[40rem] relative">
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-4 text-2xl font-bold">
        Admin Panel
      </h1>
      <div className="flex justify-center items-center h-full">
        <l-trefoil
          size="400"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.4"
          color="black"
        />
      </div>
    </main>
  );
}
