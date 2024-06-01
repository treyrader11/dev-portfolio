import { cn } from "@/lib/utils";

export default function Block({ className, title, desc, children }) {
  return (
    <div
      className={cn(
        "relative",
        "flex",
        "flex-col",
        "gap-y-2",
        "w-full",
        className
      )}
    >
      <h1 className="my-5 text-3xl font-bold font-pp-acma">{title}</h1>
      {desc && <p>{desc}</p>}
      {children}
    </div>
  );
}
