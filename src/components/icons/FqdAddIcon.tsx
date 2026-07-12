import { type SVGProps } from "react";

const FLEUR_PATH =
  "M12 2 C12 2 9 5 9 8 C9 10 10.5 11.5 12 12 C13.5 11.5 15 10 15 8 C15 5 12 2 12 2Z M8 9 C5 9 3 11 3 13 C3 15 5 16.5 7 16.5 C8 16.5 9.5 15.5 10 14.5 L10 17 L8 17 C8 17 7 17 7 18 L7 19 L17 19 L17 18 C17 17 16 17 16 17 L14 17 L14 14.5 C14.5 15.5 16 16.5 17 16.5 C19 16.5 21 15 21 13 C21 11 19 9 16 9 C14.5 9 13 10 12 11.5 C11 10 9.5 9 8 9Z";

// Fleur de lis with a blue "+" badge overlaid on the bottom-right. The fleur
// uses the `color` prop (defaults to currentColor); the badge is always blue.
export function FqdAddIcon({
  size = 24,
  color = "currentColor",
  className,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Add to French Quarter Direct"
      className={className}
      {...props}
    >
      <path d={FLEUR_PATH} fill={color} />
      {/* Blue plus badge */}
      <circle cx="19" cy="19" r="6" fill="#2563eb" />
      <rect x="15.8" y="18.3" width="6.4" height="1.4" rx="0.7" fill="#fff" />
      <rect x="18.3" y="15.8" width="1.4" height="6.4" rx="0.7" fill="#fff" />
    </svg>
  );
}
