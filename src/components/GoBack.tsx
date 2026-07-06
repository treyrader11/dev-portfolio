"use client";

import { useRouter } from "next/router";
import { RiArrowLeftLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { skipNextPageTransition } from "@/lib/page-transition";

interface Props {
  className?: string;
}

// A reusable "back to the previous page" button. Skips the page transition
// animation so returning feels instant. Rendered on every non-root, non-admin
// page (wired up in the public Layout). White pill so it reads on both light
// and dark page backgrounds.
export default function GoBack({ className }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back to the previous page"
      onClick={() => {
        skipNextPageTransition();
        router.back();
      }}
      className={cn(
        "fixed left-4 top-24 z-40 flex items-center gap-1.5 rounded-full",
        "border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-dark",
        "shadow-sm backdrop-blur transition-colors hover:bg-white sm:left-6",
        className,
      )}
    >
      <RiArrowLeftLine className="size-4" />
      Back
    </button>
  );
}
