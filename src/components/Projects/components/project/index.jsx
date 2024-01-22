"use client";

import Image from "next/image";
import { useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";
import styles from "./styles";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/common/Card";

export default function Project({
  index,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
}) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className={styles.container}>
      <Card isFolderShaped color={color} scale={scale} index={index}>
        <h2 className={cn(styles.h2, "custom-font")}>{title}</h2>
        <div className={styles.body}>
          <div className={styles.description}>
            <p className="text-[16px]">{description}</p>
            <span className="flex items-center gap-[5px]">
              <Link
                href={url || "#"}
                target="_blank"
                className="text-[12px] underline"
              >
                See more
              </Link>
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>

          <div className={styles.imageContainer}>
            <motion.div className={styles.inner} style={{ scale: imageScale }}>
              <Image
                fill
                src={`/projectImages/${src}`}
                alt="image"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}
