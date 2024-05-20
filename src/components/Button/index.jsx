import { cn } from "@/lib/utils";

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
      <span
        className={cn(
          "absolute",
          "bottom-[-110]",
          "right-[-70px]",
          "h-[140px]",
          "bg-white",
          "rounded-[50%]",
          "transition-all",
          "duration-300",
          "ease-in-out",
          "opacity-[0.2]",
          "border",
          "border-[rgb(249,215,76)]"
        )}
      />
    </button>
  );
}
