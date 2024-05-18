import { cn } from "@/lib/utils";
import Image from "next/image";
import Magnetic from "../Magnetic";
import Link from "next/link";

export default function ProfilePicture({
  src,
  className,
  height = 100,
  width = 100,
  isMagnetic = false,
}) {
  const containerProps = {
    className: cn(
      "rounded-full",
      "overflow-hidden",
      "relative",
      // "border",
      // "border",
      // "border-purple-500",
      className
    ),
    style: { height, width },
  };

  const imageProps = {
    fill: true,
    priority: true,
    alt: "image",
    src,
    className: "object-cover",
    sizes: {},
  };

  const content = isMagnetic ? (
    <Magnetic>
      <div {...containerProps}>
        <Image alt="profile picture of Trey" {...imageProps} />
      </div>
    </Magnetic>
  ) : (
    <div {...containerProps}>
      <Image alt="profile picture of Trey" {...imageProps} />
    </div>
  );

  return <Link href="/">{content}</Link>;
}
