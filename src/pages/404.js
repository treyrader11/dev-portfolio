import Scene from "@/components/Scene";
import Inner from "@/components/layout/Inner";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
  return (
    <Inner
      backgroundColor="#0f0f0f"
      className={cn(
        "relative",
        "z-[50]",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "min-h-screen"
      )}
    >
      {/* <Scene /> */}
      <h1 className="font-black text-purple-300 uppercase bg-dark text-7xl">
        404
      </h1>
      <p className="text-lg font-semibold text-white bg-dark">
        This page does not exists
      </p>
    </Inner>
  );
}
