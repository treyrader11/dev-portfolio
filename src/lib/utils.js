// "use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function scrollTo(id) {
  if (id) {
    const element = document.getElementById(id);
    console.log("element:", element);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
}

export const getUnique = (items, value) => {
  return [...new Set(items.map((item) => item[value]))];
};

export const createScrollPositions = (positions) => {
  return positions.map((pos, index) => ({
    positionId: index + 1,
    name: pos.title,
  }));
};

// export const getLocalTime = () => {
//   const now = new Date();
//   const time = now.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   return time + " CT";
// };

export const getLocalTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const formattedHours = hours < 10 ? hours : hours.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm} CT`;
};
