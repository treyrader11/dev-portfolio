// "use client";

// import { useEffect, useRef, useState, forwardRef } from "react";
// import { cn } from "@/lib/utils";
// import PageTitle from "../PageTitle";
// import { references } from "@/lib/data";
// import ProfilePicture from "../ProfilePicture";

// const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
// const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

// export default function ReferencesGSAP({ className }) {
//   const [selected, setSelected] = useState(0);

//   const DraggableSlider = () => {
//     const sliderRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const barRef = useRef(null);
//     const itemsRef = useRef([]);
//     const progressRef = useRef(0);
//     const speedRef = useRef(0);
//     const oldXRef = useRef(0);
//     const xRef = useRef(0);
//     const playrateRef = useRef(0);
//     const draggingRef = useRef(false);
//     const startXRef = useRef(0);
//     const maxScrollRef = useRef(0);

//     useEffect(() => {
//       const calculate = () => {
//         if (itemsRef.current.length > 0 && itemsRef.current[0]) {
//           const wrapWidth =
//             itemsRef.current[0].clientWidth * itemsRef.current.length;
//           if (wrapperRef.current && sliderRef.current) {
//             wrapperRef.current.style.width = `${wrapWidth}px`;
//             maxScrollRef.current = wrapWidth - sliderRef.current.clientWidth;
//           }
//         }
//       };

//       const move = () => {
//         progressRef.current = clamp(
//           progressRef.current,
//           0,
//           maxScrollRef.current
//         );
//       };

//       const handleWheel = (e) => {
//         progressRef.current += e.deltaY;
//         move();
//       };

//       const handleTouchStart = (e) => {
//         e.preventDefault();
//         draggingRef.current = true;
//         startXRef.current = e.clientX || e.touches[0].clientX;
//         sliderRef.current?.classList.add("dragging");
//       };

//       const handleTouchMove = (e) => {
//         if (!draggingRef.current) return;
//         const x = e.clientX || e.touches[0].clientX;
//         progressRef.current += (startXRef.current - x) * 2.5;
//         startXRef.current = x;
//         move();
//       };

//       const handleTouchEnd = () => {
//         draggingRef.current = false;
//         sliderRef.current?.classList.remove("dragging");
//       };

//       const raf = () => {
//         xRef.current = lerp(xRef.current, progressRef.current, 0.1);
//         playrateRef.current = xRef.current / maxScrollRef.current;

//         if (wrapperRef.current) {
//           wrapperRef.current.style.transform = `translateX(${-xRef.current}px)`;
//         }
//         if (barRef.current) {
//           barRef.current.style.transform = `scaleX(${
//             0.18 + playrateRef.current * 0.82
//           })`;
//         }

//         speedRef.current = Math.min(100, oldXRef.current - xRef.current);
//         oldXRef.current = xRef.current;

//         itemsRef.current.forEach((item) => {
//           if (item) {
//             item.style.transform = `scale(${
//               1 - Math.abs(speedRef.current) * 0.005
//             })`;
//             const img = item.querySelector("img");
//             if (img) {
//               img.style.transform = `scaleX(${
//                 1 + Math.abs(speedRef.current) * 0.004
//               })`;
//             }
//           }
//         });

//         requestAnimationFrame(raf);
//       };

//       calculate();
//       window.addEventListener("resize", calculate);
//       window.addEventListener("wheel", handleWheel);
//       sliderRef.current?.addEventListener("touchstart", handleTouchStart);
//       window.addEventListener("touchmove", handleTouchMove);
//       window.addEventListener("touchend", handleTouchEnd);
//       window.addEventListener("mousedown", handleTouchStart);
//       window.addEventListener("mousemove", handleTouchMove);
//       window.addEventListener("mouseup", handleTouchEnd);
//       sliderRef.current?.addEventListener("mouseleave", handleTouchEnd);

//       raf();

//       return () => {
//         window.removeEventListener("resize", calculate);
//         window.removeEventListener("wheel", handleWheel);
//         sliderRef.current?.removeEventListener("touchstart", handleTouchStart);
//         window.removeEventListener("touchmove", handleTouchMove);
//         window.removeEventListener("touchend", handleTouchEnd);
//         window.removeEventListener("mousedown", handleTouchStart);
//         window.removeEventListener("mousemove", handleTouchMove);
//         window.removeEventListener("mouseup", handleTouchEnd);
//         sliderRef.current?.removeEventListener("mouseleave", handleTouchEnd);
//       };
//     }, []);

//     return (
//       <section
//         ref={sliderRef}
//         className={cn("slider", "w-full", "cursor-grab", "bg-white", className)}
//       >
//         <div
//           ref={wrapperRef}
//           className={cn(
//             "slider-wrapper",
//             "whitespace-nowrap",
//             "sticky",
//             "top-0"
//           )}
//         >
//           {references.map((ref, i) => {
//             return (
//               <Card
//                 onClick={() => setSelected(i)}
//                 {...ref}
//                 ref={(el) => (itemsRef.current[i] = el)}
//                 key={i}
//                 position={i}
//                 selected={selected}
//                 setSelected={setSelected}
//               />
//             );
//           })}
//         </div>
//         <div
//           className={cn(
//             "slider-progress",
//             "fixed",
//             "z-[99]",
//             "bottom-0",
//             "left-0",
//             "w-[20vw]",
//             "h-[2px]",
//             "m-[2em]",
//             "bg-purple-600"
//           )}
//         >
//           <div ref={barRef} className={cn("slider-progress-bar")} />
//         </div>
//       </section>
//     );
//   };

//   return <DraggableSlider />;
// }

// const Card = forwardRef(
//   ({ image_url, desc, name, title, className, onClick }, ref) => {
//     return (
//       <div
//         ref={ref}
//         onClick={onClick}
//         className={cn(
//           "inline-block",
//           "w-[90vw]",
//           "p-[3vw]",
//           "border",
//           "border-4",
//           "border-slate-100",
//           "bg-dark",
//           className
//         )}
//       >
//         <figure
//           className={cn(
//             "relative",
//             "pb-[50%]",
//             "overflow-hidden",
//             // "w-full",
//             "h-[450px]",
//             "lg:h-[500px]",
//             "text-white",
//             "mx-auto",
//             "mx-6"
//           )}
//         >
//           <ProfilePicture
//             isBordered
//             src={image_url}
//             className={cn(
//               "size-[100px]",
//               "mx-auto",
//               "mt-16",
//               "border-secondary"
//             )}
//           />
//           <p
//             className={cn(
//               "my-8",
//               "text-lg",
//               "text-center",
//               "whitespace-pre-wrap",
//               "italic",
//               "font-light",
//               "lg:text-xl"
//             )}
//           >
//             &quot;{desc}&quot;
//           </p>
//           <div>
//             <h3 className={cn("text-xl", "font-pp-acma", "text-purple-500")}>
//               {name}
//             </h3>
//             <p className="block text-sm">{title}</p>
//           </div>
//         </figure>
//       </div>
//     );
//   }
// );

// Card.displayName = "Card";

"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import PageTitle from "../PageTitle";
import { references } from "@/lib/data";
import ProfilePicture from "../ProfilePicture";

const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

export default function ReferencesGSAP({ className }) {
  const [selected, setSelected] = useState(0);

  const DraggableSlider = () => {
    const sliderRef = useRef(null);
    const wrapperRef = useRef(null);
    const barRef = useRef(null);
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
          maxScrollRef.current = wrapWidth - sliderRef.current.clientWidth;
        }
      }
    };

    const move = () => {
      progressRef.current = clamp(progressRef.current, 0, maxScrollRef.current);
    };

    const handleWheel = (e) => {
      progressRef.current += e.deltaY;
      move();
    };

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
      move();
    };

    const handleTouchEnd = () => {
      draggingRef.current = false;
      sliderRef.current?.classList.remove("dragging");
    };

    useEffect(() => {
      calculate();
      window.addEventListener("resize", calculate);

      const handleMouseDown = (e) => handleTouchStart(e);
      const handleMouseMove = (e) => handleTouchMove(e);
      const handleMouseUp = () => handleTouchEnd();

      const slider = sliderRef.current;

      if (slider) {
        slider.addEventListener("wheel", handleWheel);
        slider.addEventListener("touchstart", handleTouchStart);
        slider.addEventListener("touchmove", handleTouchMove);
        slider.addEventListener("touchend", handleTouchEnd);
        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mousemove", handleMouseMove);
        slider.addEventListener("mouseup", handleMouseUp);
        slider.addEventListener("mouseleave", handleTouchEnd);
      }

      const raf = () => {
        xRef.current = lerp(xRef.current, progressRef.current, 0.1);
        playrateRef.current = xRef.current / maxScrollRef.current;

        if (wrapperRef.current) {
          wrapperRef.current.style.transform = `translateX(${-xRef.current}px)`;
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${
            0.18 + playrateRef.current * 0.82
          })`;
        }

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
        window.removeEventListener("resize", calculate);
        if (slider) {
          slider.removeEventListener("wheel", handleWheel);
          slider.removeEventListener("touchstart", handleTouchStart);
          slider.removeEventListener("touchmove", handleTouchMove);
          slider.removeEventListener("touchend", handleTouchEnd);
          slider.removeEventListener("mousedown", handleMouseDown);
          slider.removeEventListener("mousemove", handleMouseMove);
          slider.removeEventListener("mouseup", handleMouseUp);
          slider.removeEventListener("mouseleave", handleTouchEnd);
        }
      };
    }, []);

    return (
      <section
        ref={sliderRef}
        className={cn("slider", "w-full", "cursor-grab", "bg-white", className)}
      >
        <div
          ref={wrapperRef}
          className={cn(
            "slider-wrapper",
            "whitespace-nowrap",
            "sticky",
            "top-0"
          )}
        >
          {references.map((ref, i) => (
            <Card
              onClick={() => setSelected(i)}
              {...ref}
              ref={(el) => (itemsRef.current[i] = el)}
              key={i}
              position={i}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
        <div
          className={cn(
            "slider-progress",
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
          <div ref={barRef} className={cn("slider-progress-bar")} />
        </div>
      </section>
    );
  };

  return <DraggableSlider />;
}

const Card = forwardRef(
  ({ image_url, desc, name, title, className, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "inline-block",
          "w-[90vw]",
          "p-[3vw]",
          "border",
          "border-4",
          "border-slate-100",
          "bg-dark",
          "select-none",
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
      </div>
    );
  }
);

Card.displayName = "Card";
