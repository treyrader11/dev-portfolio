"use client";

import ProfilePicture from "@/components/ProfilePicture";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ReferenceCards({ references, selected, setSelected }) {
  const sliderRef = useRef < HTMLDivElement > null;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useGSAP(() => {
    setIsClient(true);
    if (isClient && sliderRef.current) initializeCards();
  }, [isClient, sliderRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) handleNext();
    }, 2500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const initializeCards = () => {
    if (!sliderRef.current) return;
    const cards = Array.from(sliderRef.current.querySelectorAll(".card"));
    gsap.to(cards, {
      y: (i) => 0 + 12 * i + "%", //originally 20
      z: (i) => 15 * i,
      duration: 1,
      ease: "power3.out",
      stagger: -0.1,
    });
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const slider = sliderRef.current;
    if (!slider) return;
    const cards = Array.from(slider.querySelectorAll(".card"));
    const lastCard = cards.pop();

    if (lastCard) {
      gsap.to(lastCard, {
        y: "+=150%",
        duration: 0.75,
        ease: "power3.inOut",
        onStart: () => {
          setTimeout(() => {
            slider.prepend(lastCard);
            initializeCards();
            setTimeout(() => {
              setIsAnimating(false);
            }, 1000);
          }, 300);
        },
      });
    } else {
      setIsAnimating(false);
    }
  };

  return (
    <div
      style={{ perspective: "175px" }}
      ref={sliderRef}
      onClick={handleNext}
      className={cn(
        // "card",
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
  const dark = "#0f0f0f";
  const background = position % 2 ? dark : "white";

  return (
    <div
      // onClick={() => setSelected(position)}
      className={cn(
     
        // "absolute",
        // "top-0",
        // "left-0",
        // "w-full",
        // "min-h-full",
        // "p-8",
        // "lg:p-12",
        // "cursor-pointer",
        // "flex",
        // "flex-col",
        // "justify-between"

        "card",
        "absolute",
        "fixed",
        // "top-1/2",
        "top-1/4",
        "left-1/2",
        "w-[65%]",
        "h-[50dvh]",
        "bg-black",
        "overflow-hidden",
        "border",
        "border-[#303030]",
        "rounded-lg",
        "flex",
        "flex-col"
      )}
    >
      <ProfilePicture
        isBordered
        src={image_url}
        className={cn("size-[100px]", "mx-auto", "mt-16", "border-secondary")}
      />
      <p
        className={cn("my-8 text-lg text-center italic font-light lg:text-xl")}
      >
        &quot;{desc}&quot;
      </p>
      <div>
        <h3
          className={cn(
            "block",
            "text-xl",
            "font-pp-acma",
            background === dark ? "text-purple-500" : "text-secondary"
          )}
        >
          {name}
        </h3>
        <p className="block text-sm">{title}</p>
      </div>
      <Overlay />
    </div>
  );
}

function Overlay() {
  return (
    <div
      className={cn(
        "absolute",
        "z-2",
        "top-0",
        "left-0",
        "w-full",
        "h-full",
        "rounded-lg"
      )}
    />
  );
}
