import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ModalItem({
  index,
  manageModal,
  href,
  className,
  children,
}) {
  return (
    <Link
      href={href}
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY);
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY);
      }}
      className={cn(
        "w-full",
        "border",
        "border-t-neutral-400",
        "transition-all",
        "duration-500",
        "group",
        "hover:opacity-50",
        className
      )}
    >
      {children}
    </Link>
  );
}
