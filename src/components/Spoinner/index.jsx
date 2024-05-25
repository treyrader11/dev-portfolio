import { cn } from "@/lib/utils";

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        className,
        "flex",
        "items-center",
        "justify-center",
        "absolute"
      )}
    >
      <svg
        className={cn(
          "mr-3",
          "-ml-1",
          "text-purple-500",
          "size-12",
          "animate-spin"
          // "absolute"
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25 animate-dash"
          stroke="currentColor"
          strokeWidth="4"
          cx="12"
          cy="12"
          r="10"
        />
        <path
          className="opacity-75 animate-dash"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
