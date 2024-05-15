import { cn } from "@/lib/utils";

export default function BackgroundVideo({ src = "/q-ba39153a.webm" }) {
  return (
    <div
      className={cn(
        // "w-[1250px]",
        "size-full",
        // "h-full",
        "z-[-10]",
        "absolute",
        "top-[-280px]",
        "flex",
        "flex-row",
        "items-start",
        "justify-center"
      )}
    >
      <video
        className="w-full h-auto rotate-180 "
        preload="false"
        playsInline
        loop
        muted
        autoPlay="autoplay"
        src={`/videos${src}`}
      />
    </div>
  );
}
