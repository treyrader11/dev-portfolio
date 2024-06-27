"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import PageTitle from "../PageTitle";
import { references } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";
import { motion } from "framer-motion";
import SelectBtns from "./SelectBtns";

// linear interpolation
const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

export default function ReferencesGSAP({ className }) {
  const [selected, setSelected] = useState(0);

  const DraggableSlider = () => {
    const sliderRef = useRef(null);
    const wrapperRef = useRef(null);
    // const barRef = useRef(null);
    const itemsRef = useRef([]);
    const progressRef = useRef(0);
    const speedRef = useRef(0);
    const oldXRef = useRef(0);
    const xRef = useRef(0);
    const playrateRef = useRef(0);
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const maxScrollRef = useRef(0);

    const calculate = () => {
      if (itemsRef.current.length > 0 && itemsRef.current[0]) {
        const wrapWidth =
          itemsRef.current[0].clientWidth * itemsRef.current.length;
        if (wrapperRef.current && sliderRef.current) {
          wrapperRef.current.style.width = `${wrapWidth}px`;
          // maxScrollRef.current = wrapWidth - sliderRef.current.clientWidth;
        }
      }
    };

    // const move = () => {
    //   progressRef.current = clamp(progressRef.current, 0, maxScrollRef.current);
    // };

    // const handleWheel = (e) => {
    //   progressRef.current += e.deltaY;
    //   move();
    // };

    const handleTouchStart = (e) => {
      draggingRef.current = true;
      startXRef.current = e.clientX || e.touches[0].clientX;
      sliderRef.current?.classList.add("dragging");
    };

    const handleTouchMove = (e) => {
      if (!draggingRef.current) return;
      const x = e.clientX || e.touches[0].clientX;
      progressRef.current += (startXRef.current - x) * 2.5;
      startXRef.current = x;
      // move();
    };

    const handleTouchEnd = () => {
      draggingRef.current = false;
      sliderRef.current?.classList.remove("dragging");
    };

    useEffect(() => {
      calculate();
      // window.addEventListener("resize", calculate);

      const handleMouseDown = (e) => handleTouchStart(e);
      const handleMouseMove = (e) => handleTouchMove(e);
      const handleMouseUp = () => handleTouchEnd();

      const slider = sliderRef.current;

      if (slider) {
        // slider.addEventListener("wheel", handleWheel);
        // slider.addEventListener("touchstart", handleTouchStart);
        // slider.addEventListener("touchmove", handleTouchMove);
        // slider.addEventListener("touchend", handleTouchEnd);
        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mousemove", handleMouseMove);
        slider.addEventListener("mouseup", handleMouseUp);
        // slider.addEventListener("mouseleave", handleTouchEnd);
      }

      // request animation frame
      const raf = () => {
        xRef.current = lerp(xRef.current, progressRef.current, 0.1);
        playrateRef.current = xRef.current / maxScrollRef.current;

        if (wrapperRef.current)
          wrapperRef.current.style.transform = `translateX(${-xRef.current}px)`;

        speedRef.current = Math.min(100, oldXRef.current - xRef.current);
        oldXRef.current = xRef.current;

        itemsRef.current.forEach((item) => {
          if (item) {
            item.style.transform = `scale(${
              1 - Math.abs(speedRef.current) * 0.005
            })`;
            const img = item.querySelector("img");
            if (img) {
              img.style.transform = `scaleX(${
                1 + Math.abs(speedRef.current) * 0.004
              })`;
            }
          }
        });
        requestAnimationFrame(raf);
      };

      raf();

      return () => {
        // window.removeEventListener("resize", calculate);
        if (slider) {
          // slider.removeEventListener("wheel", handleWheel);
          // slider.removeEventListener("touchstart", handleTouchStart);
          // slider.removeEventListener("touchmove", handleTouchMove);
          // slider.removeEventListener("touchend", handleTouchEnd);
          slider.removeEventListener("mousedown", handleMouseDown);
          slider.removeEventListener("mousemove", handleMouseMove);
          slider.removeEventListener("mouseup", handleMouseUp);
          // slider.removeEventListener("mouseleave", handleTouchEnd);
        }
      };
    }, []);

    return (
      <section
        ref={sliderRef}
        className={cn(
          // "slider",
          "w-full",
          "cursor-grab",
          "bg-white",
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
          {/* <SelectBtns
            numTracks={references.length}
            setSelected={setSelected}
            selected={selected}
          /> */}
        </div>
        <div
          ref={wrapperRef}
          className={cn(
            // "slider-wrapper",
            // "whitespace-nowrap",
            // "sticky",
            // "top-0",
            // "border border-red-500",

            "p-4",
            "relative",
            "h-[450px]",
            "lg:h-[500px]",
            "shadow-xl",
            "space-x-5"
          )}
        >
          {references.map((ref, i) => (
            <Card
              // onClick={() => setSelected(i)}
              {...ref}
              ref={(el) => (itemsRef.current[i] = el)}
              key={i}
              position={i}
              selected={selected}
              setSelected={setSelected}
              className={cn()}
            />
          ))}
        </div>
        {/* <ProgressBar ref={barRef} className={cn("slider-progress")} /> */}
      </section>
    );
  };

  return <DraggableSlider />;
}

const Card = forwardRef(
  (
    {
      image_url,
      desc,
      name,
      title,
      className,
      onClick,
      setSelected,
      selected,
      position,
    },
    ref
  ) => {
    const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
    const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
    const dark = "#0f0f0f";
    const background = position % 2 ? dark : "white";
    const color = position % 2 ? "white" : dark;

    console.log("position", position);

    return (
      <motion.div
        ref={ref}
        // onClick={onClick}
        onClick={() => setSelected(position)}
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
        className={cn(
          "inline-block",
          "w-[90vw]",
          "p-[3vw]",
          "border",
          "border-4",
          "border-slate-100",
          "bg-dark",
          "select-none",

          // "absolute",
          // "top-0",
          // "left-0",
          // "w-full",
          // "min-h-full",
          // "p-8",
          // "lg:p-12",
          // "flex",
          // "flex-col",
          // "justify-between",
          className
        )}
      >
        <figure
          className={cn(
            "relative",
            "pb-[50%]",
            "overflow-hidden",
            // "w-full",
            "h-[450px]",
            "lg:h-[500px]",
            "text-white",
            "mx-auto",
            "mx-6"
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
          <p
            className={cn(
              "my-8",
              "text-lg",
              "text-center",
              "whitespace-pre-wrap",
              "italic",
              "font-light",
              "lg:text-xl"
            )}
          >
            &quot;{desc}&quot;
          </p>
          <div>
            <h3 className={cn("text-xl", "font-pp-acma", "text-purple-500")}>
              {name}
            </h3>
            <p className="block text-sm">{title}</p>
          </div>
        </figure>
      </motion.div>
    );
  }
);

Card.displayName = "Card";

const ProgressBar = forwardRef(({ className }, ref) => {
  return (
    <div
      className={cn(
        "fixed",
        "z-[99]",
        "bottom-0",
        "left-0",
        "w-[20vw]",
        "h-[2px]",
        "m-[2em]",
        "bg-purple-600"
      )}
    >
      <div ref={ref} className={cn("slider-progress-bar")} />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
