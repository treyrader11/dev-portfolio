"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import PageTitle from "../PageTitle";
import ReferenceCards from "./components/ReferenceCards";
import SelectBtns from "./components/SelectBtns";
import { references } from "@/lib/data";

export default function References({ className }) {
  const [selected, setSelected] = useState(0);
  return (
    <section
      className={cn(
        "bg-white",
        "py-24",
        "sm:px-8",
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
        <PageTitle
          once={false}
          delay={0.8}
          backgroundColor="white"
          containerClass={cn("p-0 pl-0 h-[6rem]")}
          title="References."
          className={cn("py-0 font-pp-acma text-[14vw]")}
        />
        <SelectBtns
          numTracks={references.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <ReferenceCards
        references={references}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
}
