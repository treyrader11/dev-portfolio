import { cn } from "@/lib/utils";

export default function Block({ className, title, desc, children }) {
  const targetedWords = desc
    ?.split(" ")
    ?.filter((word) => word.includes(".env") || word.includes("local.env"));

  return (
    <div
      className={cn(
        "relative",
        "flex",
        "flex-col",
        "gap-y-2",
        "w-full",
        "px-6",
        className
      )}
    >
      <h1 className="my-5 text-3xl font-bold">{title}</h1>
      {desc && <p>{desc}</p>}
      {children}
    </div>
  );
}
