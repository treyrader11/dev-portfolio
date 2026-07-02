import Image from "next/image";
import { cn, resolveImageSrc } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

// mockup-laptop-frame.png is 1417 x 1417 — a perfect square
const FRAME_ASPECT = "1 / 1";

// Measured from the frame PNG's transparent screen hole (bbox 245,467 -> 1172,997
// of 1417x1417), with a ~0.4% outward bleed so the screenshot tucks under the
// bezel with no hairline gaps. The frame on top masks the rounded corners.
const SCREEN = { top: "32.6%", left: "16.9%", width: "66.3%", height: "38.3%" };

// The mockup renders up to ~900px wide (see LatestWorkFlipCard); on mobile it's
// close to the viewport width.
const SIZES = "(max-width: 640px) 94vw, 900px";

export default function LaptopMockup({ src, alt, className }: Props) {
  const resolvedSrc = resolveImageSrc(src);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: FRAME_ASPECT }}
    >
      {/* Screenshot sits behind the transparent screen hole */}
      <div className="absolute overflow-hidden" style={SCREEN}>
        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt={alt}
            fill
            sizes={SIZES}
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-black" />
        )}
      </div>

      {/* Frame overlay — object-fill stretches it to fill the 1:1 wrapper exactly */}
      <Image
        src="/mockup-laptop-frame.png"
        alt=""
        aria-hidden
        fill
        sizes={SIZES}
        className="object-fill z-10 pointer-events-none"
      />
    </div>
  );
}
