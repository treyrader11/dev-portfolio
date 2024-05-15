"use client";

import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Dependencies({ data }) {
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

  const copydata = data.package?.map((data) => data);

  return (
    <div className="w-full h-auto">
      <span className="my-5 text-2xl font-bold text-slate-200">
        Dependencies
      </span>
      <p className="text-base text-gray-300">{data.dependencies_blog}</p>
      <div
        className={cn(
          "my-[15px]",
          "w-full",
          "h-auto",
          "relative",
          "group",
          "py-[15px]",
          "px-2.5",
          "border",
          "text-slate-200",
          "rounded-[10px]",
          "bg-[#0c0728]",
          "border-[#401f788e]"
        )}
      >
        {data.package?.map((data) => (
          <div
            key={data}
            className={cn(
              "w-full",
              "h-auto",
              "hover:bg-gray-300/20",
              "rounded",
              "px-[15px]"
            )}
          >
            {data}
          </div>
        ))}

        {havecopy ? (
          <div
            id="button-primary"
            onClick={() => sethavecopy(false)}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-[15px]",
              "py-[5px]",
              "cursor-pointer",
              "rounded-[5px]"
            )}
          >
            <CheckCircleIcon className="text-teal-400 size-5" />
            <span className=" ml-[7px] text-teal-400 text-base">Copied!</span>
          </div>
        ) : (
          <div
            id="button-primary"
            onClick={() => Copy(data.package)}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-[15px]",
              "py-[5px]",
              "cursor-pointer",
              "rounded-[5px]"
            )}
          >
            <ClipboardDocumentCheckIcon className="text-white size-5" />
            <span className="text-base ml-[7px]">Copy</span>
          </div>
        )}
      </div>
    </div>
  );
}
