import { cn } from "@/lib/utils";
import Link from "next/link";

export default function StyledLink({
  className,
  children,
  href,
  target = "#",
}) {
  return (
    <Link
      href={href || "#"}
      target={target}
      className={cn(
        "m-0",
        "p-[2.5px]",
        "cursor-pointer",
        "after:w-0",
        "after:h-px",
        "after:bg-white",
        "after:block",
        "after:mt-[2px]",
        "after:relative",
        "after:left-1/2",
        "after:transform",
        "after:-translate-x-[-50%]",
        "after:transition-[width]",
        "after:duration-200",
        "after:ease-linear",
        "hover:after:w-full",

        className
      )}
    >
      {children}
    </Link>
  );
}
