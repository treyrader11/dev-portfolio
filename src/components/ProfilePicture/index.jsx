import { cn } from "@/lib/utils";
import Image from "next/image";
import Magnetic from "../Magnetic";

export default function ProfilePicture({
  src,
  className,
  isBordered = false,
  isMagnetic = false,
  isBlob = false,
}) {
  const containerProps = {
    className: cn(
      "rounded-full",
      "overflow-hidden",
      "relative",
      "flex",
      { "border border-secondary": isBordered },
      className
    ),
  };

  const imageProps = {
    fill: true,
    priority: true,
    alt: "image",
    src,
    className: "object-cover",
    sizes: {},
  };

  const content = isBlob ? (
    <Magnetic>
      <Image
        width={50}
        height={50}
        src={src}
        className={cn("blob", "animate-blob", "size-[85px]", "object-cover")}
        alt="profile picture of Trey"
      />
    </Magnetic>
  ) : (
    <div {...containerProps}>
      <Image alt="profile picture of Trey" {...imageProps} />
    </div>
  );

  return content;
}
