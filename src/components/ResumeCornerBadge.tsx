"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import ResumeModal from "@/components/ResumeModal";

const HIDDEN_ROUTES = ["/admin"];

export default function ResumeCornerBadge() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const shouldHide = HIDDEN_ROUTES.some((r) => router.pathname.startsWith(r));

  // Mobile screens only, and never on admin pages. When the slideout menu opens
  // it sits at z-[100] and visually covers this badge (z-[99]).
  if (shouldHide || !mounted || !isMobile) return null;

  return (
    <>
      <div className={cn("fixed", "left-0", "top-0", "z-[99]")}>
        <button
          type="button"
          title="Get my résumé"
          aria-label="Get my résumé"
          onClick={() => setModalOpen(true)}
          className={cn("group", "relative", "block", "cursor-pointer")}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className={cn("h-20", "w-20", "drop-shadow-md")}
          >
            <title>Get my résumé</title>
            {/* Corner triangle */}
            <path
              d="M0 0 H80 L0 80 Z"
              className={cn(
                "fill-[#a855f7]",
                "transition-colors",
                "duration-300",
                "group-hover:fill-[#9333ea]"
              )}
            />
            {/* CV label */}
            <text
              x="25"
              y="25"
              fill="#ffffff"
              fontSize="17"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="middle"
              transform="rotate(-45 25 25)"
              className={cn(
                "select-none",
                "transition-transform",
                "duration-300",
                "group-hover:-translate-y-0.5"
              )}
            >
              CV
            </text>
          </svg>
        </button>
      </div>

      <ResumeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
