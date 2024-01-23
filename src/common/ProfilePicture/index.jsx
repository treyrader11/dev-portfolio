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
  if (isMagnetic) {
    return (
      <Magnetic>
        <div
          className={cn(styles.container, className)}
          style={{ height, width }}
        >
          <Image
            priority
            fill
            alt={"image"}
            src={src}
            className="object-cover"
            sizes={{}}
          />
        </div>
      </Magnetic>
    );
  } else {
    return (
      <div
        className={cn(styles.container, className)}
        style={{ height, width }}
      >
        <Image
          fill={true}
          priority
          alt={"image"}
          src={src}
          className="object-cover"
          sizes={{}}
        />
      </div>
    );
  }
}
