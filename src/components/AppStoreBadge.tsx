import { cn } from "@/lib/utils";

interface Props {
  href: string;
  // Pixel width; height auto-scales to the 3:1 badge aspect ratio.
  width?: number;
  className?: string;
  ariaLabel?: string;
}

// Apple's official "Download on the App Store" badge as an inline SVG (mirrors
// the Mardimix implementation) so it scales crisply at any size and needs no
// asset. Black pill with the Apple glyph + wordmark, per Apple's marketing
// guidelines. Always an outbound link.
export default function AppStoreBadge({
  href,
  width = 180,
  className,
  ariaLabel = "Download on the App Store",
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-block transition-opacity hover:opacity-90",
        className,
      )}
      style={{ width }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 40"
        role="img"
        aria-hidden="true"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="119"
          height="39"
          rx="6"
          ry="6"
          fill="#000000"
          stroke="#A6A6A6"
          strokeWidth="1"
        />
        <g fill="#FFFFFF" transform="translate(10 7)">
          <path d="M14.32 13.43c-.02-2.66 2.18-3.94 2.28-4-1.24-1.81-3.18-2.06-3.86-2.09-1.64-.17-3.2.96-4.03.96-.84 0-2.12-.94-3.48-.91-1.79.03-3.43 1.04-4.35 2.62-1.86 3.22-.48 7.98 1.34 10.6.89 1.28 1.95 2.72 3.35 2.66 1.35-.05 1.86-.86 3.49-.86 1.62 0 2.09.86 3.51.83 1.45-.02 2.37-1.3 3.26-2.58.94-1.43 1.36-2.83 1.39-2.9-.03-.01-2.91-1.11-2.94-4.34zM11.71 5.65c.74-.9 1.24-2.14 1.1-3.39-1.07.04-2.36.71-3.13 1.6-.68.79-1.29 2.07-1.12 3.29 1.19.09 2.4-.6 3.15-1.5z" />
        </g>
        <text
          x="30"
          y="14"
          fill="#FFFFFF"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="7"
          fontWeight="400"
        >
          Download on the
        </text>
        <text
          x="30"
          y="29"
          fill="#FFFFFF"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="17"
          fontWeight="600"
          letterSpacing="-0.3"
        >
          App Store
        </text>
      </svg>
    </a>
  );
}
