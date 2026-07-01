import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { RiExternalLinkLine } from "react-icons/ri";

interface Props {
  className?: string;
}

// rounded-square, sheen). Bottom-left; z-30 so the open drawer covers it.
export default function ViewSiteFab({ className }: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/"
      aria-label="View site"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        // "flex",
        // "fixed",
        // "items-center",
        // "justify-center",
        "admin-fab",
        // "z-30",
        // "bottom-6",
        // "right-6",
        // "size-12",
        className,
      )}
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
        bottom: 28,
        right: 28,
        width: 52,
        height: 52,
        borderRadius: 14,
        color: "#c084fc",
        background: "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(192,132,252,0.4)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 300ms ease-out",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        boxShadow: hovered ? "0 0 20px rgba(192,132,252,0.15)" : "none",
        textDecoration: "none",
      }}
    >
      <span className="admin-fab-sheen" />
      <RiExternalLinkLine
        style={{ position: "relative", zIndex: 1, width: 22, height: 22 }}
      />
      <span
        style={{
          position: "absolute",
          right: "100%",
          marginRight: 12,
          whiteSpace: "nowrap",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 500,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          color: "#c084fc",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
          transition: "all 200ms ease-out",
          pointerEvents: "none",
        }}
      >
        View site
      </span>
    </Link>
  );
}
