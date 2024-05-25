"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { references } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";

export default function References({ className }) {
  const [selected, setSelected] = useState(0);

  return (
    <section
      className={cn(
        "bg-white",
        "py-24",
        "px-4",
        "lg:px-8",
        "grid",
        "items-center",
        "grid-cols-1",
        "lg:grid-cols-2",
        "gap-8",
        "lg:gap-4",
        "overflow-hidden",
        className
      )}
    >
      <div className="relative p-4 mt-0 ">
        {/* <PageTitle
          containerClass="h-0"
          className="text-[10vw]"
          backgroundColor="transparent"
          title="References."
        /> */}
        {/* <h1 className="my-4 font-light text-slate-500">
          I&apos;ve had the pleasure to work with the following professionals below.
          Here are a few of their words.
        </h1> */}
        <h1 className="my-4 text-[10vw] font-bold text-slate-200">
          References
        </h1>
        <SelectBtns
          numTracks={references.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <Cards
        references={references}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
}

function SelectBtns({ numTracks, setSelected, selected }) {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-1.5 w-full bg-slate-300 relative"
          >
            {selected === n ? (
              <motion.span
                className="absolute top-0 bottom-0 left-0 bg-secondary"
                initial={{
                  width: "0%",
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 5,
                }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute inset-y-0 left-0 bg-secondary"
                style={{
                  width: selected > n ? "100%" : "0%",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Cards({ references, selected, setSelected }) {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl">
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
        src={image_url.src}
        className={cn(
          "size-[100px]",
          "mx-auto",
          "mt-16",
          background !== dark ? "border-purple-500" : "border-secondary"
        )}
      />
      <p className={cn("my-8 text-lg italic font-light lg:text-xl")}>
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