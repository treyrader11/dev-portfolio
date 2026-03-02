import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  isActive?: boolean;
}

export default function PaperPlane({ className, isActive }: Props) {
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
          "[transform:translate(0,0_translateZ(0))]"
        )}
      />
      <div
        className={cn(
          "right",
          "absolute",
          "inset-0",
          "[transform:translate(0,0_translateZ(0))]"
        )}
      />
    </div>
  );
}
