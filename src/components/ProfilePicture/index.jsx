import { cn } from "@/lib/utils";
import Image from "next/image";
import Magnetic from "../Magnetic";
import Link from "next/link";

export default function ProfilePicture({
  src,
  className,
  isBordered = false,
  isMagnetic = false,
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

  return <div>{content}</div>;
}
