import { cn } from "@/lib/utils";

export default function Block({ className, title, desc, children }) {
  return (
    <div className={cn("flex relative flex-col gap-y-2 w-full", className)}>
      <h1 className="my-5 text-3xl font-bold">{title}</h1>
      {desc && <p className="">{desc}</p>}
      {children}
    </div>
  );
}
