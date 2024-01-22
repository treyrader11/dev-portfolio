import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProfilePicture({
  src,
  className,
  height = 100,
  width = 100,
}) {
  return (
    <div
      className={cn("rounded-full", "overflow-hidden", "relative", className)}
      style={{ height, width }}
    >
      <Image fill={true} alt={"image"} src={src} className="object-cover" />
    </div>
  );
}
