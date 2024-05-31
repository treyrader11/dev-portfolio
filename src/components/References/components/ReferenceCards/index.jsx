"use client";

import ProfilePicture from "@/components/ProfilePicture";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ReferenceCards({ references, selected, setSelected }) {
  return (
    <div
      className={cn(
        "p-4",
        "relative",
        "h-[450px]",
        "lg:h-[500px]",
        "shadow-xl"
      )}
    >
      {references.map((ref, i) => {
        return (
          <Card
            {...ref}
            key={i}
            position={i}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
}

function Card({
  image_url,
  desc,
  name,
  title,
  position,
  selected,
  setSelected,
}) {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const dark = "#0f0f0f";
  const background = position % 2 ? dark : "white";
  const color = position % 2 ? "white" : dark;

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: "left bottom",
        background,
        color,
      }}
      animate={{
        x: `${offset}%`,
        scale,
      }}
      whileHover={{
        translateX: position === selected ? 0 : -3,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onClick={() => setSelected(position)}
      className={cn(
        "absolute",
        "top-0",
        "left-0",
        "w-full",
        "min-h-full",
        "p-8",
        "lg:p-12",
        "cursor-pointer",
        "flex",
        "flex-col",
        "justify-between"
      )}
    >
      <ProfilePicture
        isBordered
        src={image_url}
        className={cn(
          "size-[100px]",
          "mx-auto",
          "mt-16",
          "border-secondary"
        )}
      />
      <p className={cn("my-8 text-lg text-center italic font-light lg:text-xl")}>
        &quot;{desc}&quot;
      </p>
      <div>
        <h3
          className={cn(
            "block",
            "text-lg",
            background === dark ? "text-purple-500" : "text-secondary"
          )}
        >
          {name}
        </h3>
        <p className="block text-sm">{title}</p>
      </div>
    </motion.div>
  );
}
