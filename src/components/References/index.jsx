"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { references } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";

gsap.registerPlugin(useGSAP);

export default function References() {
  const sliderRef = useRef(null);
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
      y: (i) => 0 + 4 * i + "%", //originally 20
      z: (i) => 10 * i,
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
      className={cn("size-full pt-[40%] relative z-[3]")}
      onClick={handleNext}
      ref={sliderRef}
    >
      {references.map((card, i) => (
        <Card key={i} {...card} />
      ))}
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
        "card",
        "absolute",
        
        "fixed",
        "z-[99]",
        
        "top-1/4",
        "left-0",
        "inset-x-0",
       
       
        "bg-slate-50",
        "overflow-hidden",
        "border",
        "border-[#303030]",
        "rounded-lg",
        "flex",
        "flex-col",
        "text-white"
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
      {/* <Overlay /> */}
    </div>
  );
}
