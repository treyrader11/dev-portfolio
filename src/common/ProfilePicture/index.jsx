import { cn } from "@/lib/utils";
import Image from "next/image";
import Magnetic from "../Magnetic";
import styles from "./styles";

export default function ProfilePicture({
  src,
  className,
  height = 100,
  width = 100,
  isMagnetic = false,
}) {
  const containerProps = {
    className: cn(styles.container, className),
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
        <Image {...imageProps} />
      </div>
    </Magnetic>
  ) : (
    <div {...containerProps}>
      <Image {...imageProps} />
    </div>
  );

  return content;
}
