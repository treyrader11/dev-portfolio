import { cn } from "@/lib/utils";
import Image from "next/image";
import Magnetic from "../../common/Magnetic";
import Link from "next/link";

export default function ProfilePicture({ src, className, isMagnetic = false }) {
  const containerProps = {
    className: cn(
      "rounded-full",
      "overflow-hidden",
      "relative",
      "flex",
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

  return <Link href="/">{content}</Link>;
}
