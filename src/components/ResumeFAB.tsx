"use client";

import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import ResumeModal from "@/components/ResumeModal";

const HIDDEN_ROUTES = ["/admin"];

// Brand purple — Tailwind purple-500, the dominant accent across the app.
const PURPLE = "#a855f7";

export default function ResumeFAB() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.getElementById("resume-fab-portal");
    setMounted(true);
  }, []);

  const shouldHide = HIDDEN_ROUTES.some((r) => router.pathname.startsWith(r));

  // Mobile screens only, and never on admin pages.
  if (shouldHide || !mounted || !isMobile || !portalRef.current) return null;

  return (
    <>
      {createPortal(
        <button
          type="button"
          aria-label="Get my résumé"
          onClick={() => setModalOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="admin-fab"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            top: 20,
            left: 20,
            width: 52,
            height: 52,
            borderRadius: 14,
            color: "#ffffff",
            background: PURPLE,
            border: hovered
              ? "1px solid rgba(255,255,255,0.55)"
              : "1px solid rgba(255,255,255,0.18)",
            transition: "all 300ms ease-out",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            boxShadow: hovered
              ? "0 0 22px rgba(168,85,247,0.55)"
              : "0 4px 14px rgba(168,85,247,0.4)",
            cursor: "pointer",
          }}
        >
          {/* Sheen overlay (shared with the admin FAB) */}
          <span className="admin-fab-sheen" />
          <BsFillPersonLinesFill size={24} style={{ position: "relative", zIndex: 1 }} />

          {/* Tooltip */}
          <span
            style={{
              position: "absolute",
              left: "100%",
              marginLeft: 12,
              whiteSpace: "nowrap",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-8px)",
              transition: "all 200ms ease-out",
              pointerEvents: "none",
            }}
          >
            Résumé
          </span>
        </button>,
        portalRef.current,
      )}

      <ResumeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
