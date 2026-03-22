import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const HIDDEN_ROUTES = ["/admin", "/contact"];

function AdminIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-[1]"
    >
      {/* Lock shackle at top */}
      <path d="M9 6.5V5a3 3 0 0 1 6 0v1.5" />
      {/* Shield body */}
      <path d="M5 7.5h14l-1 10.5a2 2 0 0 1-1 1.5L12 22l-5-2.5a2 2 0 0 1-1-1.5L5 7.5z" />
      {/* Terminal prompt >_ */}
      <path d="M9 13l2 1.5L9 16" />
      <line x1="13" y1="16" x2="15.5" y2="16" />
    </svg>
  );
}

export default function AdminFAB() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Hide on admin routes, contact, and login
  const shouldHide = HIDDEN_ROUTES.some((r) =>
    router.pathname.startsWith(r)
  );
  if (shouldHide) return null;

  return (
    <Link
      href="/admin"
      aria-label="Admin dashboard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="admin-fab fixed z-50 flex items-center justify-center text-purple-400 transition-all duration-300 ease-out"
      style={{
        bottom: 28,
        left: 28,
        width: 52,
        height: 52,
        borderRadius: 14,
        background: "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(192,132,252,0.4)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        boxShadow: hovered
          ? "0 0 20px rgba(192,132,252,0.15)"
          : "none",
      }}
    >
      {/* Sheen overlay */}
      <span className="admin-fab-sheen" />
      <AdminIcon />

      {/* Tooltip */}
      <span
        className="absolute left-full ml-3 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          color: "#c084fc",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          pointerEvents: "none",
        }}
      >
        Admin
      </span>
    </Link>
  );
}
