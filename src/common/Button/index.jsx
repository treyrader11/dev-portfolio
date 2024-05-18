import { cn } from "@/lib/utils";
import React from "react";
cn;

export default function Button({
  name,
  blob,
  color,
  icon,
  bg,
  bFw,
  bRad,
  bPad,
}) {
  return (
    <button
      className={cn(
        "flex",
        "items-center",
        "justify-center",
        "outline-none",
        "border-none",
        "cursor-pointer",
        "overflow-hidden",
        "relatve"
      )}
      style={{
        backgroundColor: bg,
        color: color,
        borderRadius: bRad,
        padding: bPad,
        fontWeight: bFw,
      }}
      theme={theme}
    >
      {name}
      <span className="ml-[.6rem]">{icon}</span>

      <div
        className={cn(
          "scale-[1.4]",
          "border",
          "border-secondary",
          "transition-all",
          "duration-300",
          "ease-in-out"
        )}
      />
    </button>
  );
}
