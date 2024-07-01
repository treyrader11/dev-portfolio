import { cn } from "@/lib/utils";
import { VscSend } from "react-icons/vsc";
import { forwardRef } from "react";
import PaperPlane from "../PaperPlane";

const SubmitEmail = forwardRef(({ isActive, disabled }, ref) => {
  return (
    <button
      style={{ WebkitTapHighlightColor: "transparent" }}
      ref={ref}
      className={cn(
        { active: isActive },
        disabled &&
          cn("disabled:grayscale-[65%]", "disabled:cursor-not-allowed"),
        "text-sm",
        "md:text-base",
        "relative",
        "py-2",
        "min-4-[100px]",
        "text-center",
        "text-white",
        "[transform:translateZ(0)]",
        "transition-[opacity,filter]",
        "duration-[0.25s]",
        "flex",
        "justify-center",
        "items-center",
        "w-full",
        "mx-auto",
        "py-6"
      )}
      // disabled={!input}
      // disabled={disabled}
      type="submit"
    >
      <span
        className={cn("relative", "z-[4]", "flex", "items-center", "gap-2", {
          "opacity-0": isActive,
        })}
      >
        Send <VscSend />
      </span>
      <span
        className={cn(
          // ".success" determines animation/transform
          "success",
          "text-emerald-500",
          "z-0",
          "absolute",
          "inset-x-0",
          "top-2",
          "-translate-x-3",
          "flex",
          "justify-center",
          "items-center",
          "opacity-0",
          {
            "opacity-100 [transform:translateX(-3px)_translateZ(0)]": isActive,
          }
        )}
      >
        <svg
          // This is the check mark
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={14}
          className={cn(
            "stroke-2",
            "w-6",
            "stroke-emerald-500",
            "pointer-events-none"
          )}
          viewBox="0 0 16 16"
        >
          <polyline points="3.75 9 7 12 13 5" />
        </svg>
        Sent
      </span>
      <PaperPlane isActive={isActive} />
    </button>
  );
});

export default SubmitEmail.displayName = "SubmitEmail";
