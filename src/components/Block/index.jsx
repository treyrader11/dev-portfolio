import { cn } from "@/lib/utils";

export default function Block({ className, title, desc, children }) {
  const targetedWords = desc
    ?.split(" ")
    ?.filter((word) => word.includes(".env") || word.includes("local.env"));

  return (
    <div className={cn("flex relative flex-col gap-y-2 w-full", className)}>
      <h1 className="my-5 text-3xl font-bold">{title}</h1>
      {desc && (
        // <p className={cn("w-[1000px]", "p-[40px]", "mt-[20%]")}>
        //   {desc.split(" ").map((word, index) => {
        //     const isTargetedWord = targetedWords.includes(word.toLowerCase());

        //     return isTargetedWord ? <code key={index}>{word}</code> : word ;
        //   })}
        // </p>

        <p>{desc}</p>
      )}
      {children}
    </div>
  );
}
