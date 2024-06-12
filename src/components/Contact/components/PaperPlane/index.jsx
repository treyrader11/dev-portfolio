import { cn } from "@/lib/utils";

export default function PaperPlane({ className, isActive }) {
  return (
    <div
      className={cn(
        "plane",
        "pointer-events-none",
        "absolute",
        "inset-0",
        "[transform:translate(0,0)_rotate(0)_translateZ(0)]",
        className
      )}
    >
      <div
        className={cn(
          "left",
          "absolute",
          "inset-0",
          // "opacity-0",
          // {"opacity-100": isActive},
          "[transform:translate(0,0_translateZ(0))]"
        )}
      />
      <div
        className={cn(
          "right",
          "absolute",
          "inset-0",
          // "opacity-0",
          // {"opacity-100": isActive},
          "[transform:translate(0,0_translateZ(0))]"
        )}
      />
    </div>
  );
}
