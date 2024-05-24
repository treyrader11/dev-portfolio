"use client";

import { FaRegCheckCircle } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Environnment({ data, desc }) {
  const [havecopy, sethavecopy] = useState(false);

  const Copy = (e) => {
    sethavecopy(true);
    navigator.clipboard.writeText(e);
    const myTimeout = setTimeout(myStopFunction, 5000);
    function myStopFunction() {
      sethavecopy(false);
      clearTimeout(myTimeout);
    }
  };

  return (
    <div className="w-full h-auto">
      <span className="my-5 text-2xl font-bold">Environment</span>
      <p>{desc}</p>
      <div
        className={cn(
          "my-4",
          "w-full",
          "h-auto",
          "relative",
          "group",
          "py-4",
          "px-2.5",
          "border",
          "text-slate-200",
          "rounded-lg",
          "bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)]",
          "border",
          "border-purple-500"
        )}
      >
        {data.map((data) => (
          <div
            key={data}
            className={cn(
              "w-full",
              "h-auto",
              "hover:bg-gray-300/20",
              "rounded",
              "px-4"
            )}
          >
            {data}
          </div>
        ))}

        {havecopy ? (
          <div
            onClick={() => sethavecopy(false)}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-4",
              "py-[5px]",
              "cursor-pointer",
              "rounded-[5px]"
            )}
          >
            <FaRegCheckCircle className="text-teal-400 size-5" />
            <span className="ml-1.5 text-teal-400">Copied!</span>
          </div>
        ) : (
          <div
            onClick={() => Copy(data[0].env)}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-4",
              "py-[5px]",
              "cursor-pointer",
              "rounded-md"
            )}
          >
            <LuCopyCheck className="text-white size-5" />
            <span className="ml-1.5">Copy</span>
          </div>
        )}
      </div>
    </div>
  );
}
