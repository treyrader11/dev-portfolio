"use client";

import { cn } from "@/lib/utils";
import { GoArrowLeft } from "react-icons/go";
import { useRouter } from "next/navigation";

export default function GoBack({ className }) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "w-full",
        "min-h-[70px]",
        "flex",
        "flex-row",
        "items-center",
        "justify-start",
        "px-2.5",
        className
      )}
    >
      <div
        onClick={() => router.back()}
        // href={"/"}
        className={cn(
          "static",
          "flex",
          "flex-row",
          "items-center",
          "justify-start",
          "cursor-pointer",
          "1000:fixed",
          "text-slate-200",
          "hover:text-sky-500"
        )}
      >
        <GoArrowLeft className="size-4 mr-[5px]" />
        <span className="text-base">Back</span>
      </div>
    </div>
  );
}
